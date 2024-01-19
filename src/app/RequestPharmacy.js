import React, { useState, useEffect } from "react";
import { Button, Table, Input, Modal } from "antd";
import Cookies from "js-cookie";
import { SearchOutlined } from "@ant-design/icons";

const RequestPharmacy = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejecteReason, setRejecteReason] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);

  const filteredpharmacy = data
    ? data.filter((pharmacyData) =>
        pharmacyData.userName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  const userId = data[0]?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          `https://mymedjournal.blownclouds.com/api/inactive/fatch/Pharmacies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const pharmacyData = Array.isArray(responseData.inactive_pharmacies)
            ? responseData.inactive_pharmacies
            : [];

          setData(pharmacyData);
        } else {
          console.error(
            "Failed to fetch pharmacy request. Status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching pharmacy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleActivate = async (userId) => {
    try {
      const token = Cookies.get("apiToken");

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/inactive/fatch/Pharmacies?userId=${userId}&isAprovel=accept`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = data.filter((pharmacy) => pharmacy.id !== userId);
        setData(updatedData);
      } else {
        console.error("Failed to activate pharmacy. Status:", response.status);
      }
    } catch (error) {
      console.error("Error activating pharmacy:", error);
    }
  };
  const handleRejectModalOpen = (userId) => {
    setRejectModalVisible(true);
    setSelectedUserId(userId);
  };

  const handleRejectReason = async (userId) => {
    try {
      const token = Cookies.get("apiToken");

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/reject/reason/Pharmacies?userId=${userId}&isAprovel=reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ rejecteReason }),
        }
      );

      if (response.ok) {
        const updatedpharmacy = data.map((pharmacy) =>
          pharmacy.id === userId
            ? { ...pharmacy, rejecteReason: rejecteReason }
            : pharmacy
        );

        setData(updatedpharmacy);
        setRejectModalVisible(false);
        setRejecteReason("");
      } else {
        console.error("Failed to reject pharmacy. Status:", response.status);
      }
    } catch (error) {
      console.error("Error rejecting pharmacy:", error);
    }
  };
  const handleReject = async (userId) => {
    try {
      const token = Cookies.get("apiToken");

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/inactive/fatch/Pharmacies?userId=${userId}&isAprovel=reject`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setRejectModalVisible(false);
        console.log("Doctor rejected successfully");
      } else {
        console.error("Failed to reject doctor. Status:", response.status);
      }
    } catch (error) {
      console.error("Error rejecting Doctor:", error);
    }
  };

  const dataSourceWithSerial = filteredpharmacy.map((pharmacyData, index) => ({
    ...pharmacyData,
    key: pharmacyData.id,
    serialNumber: index + 1,
  }));
  const columns = [
    { title: "No", dataIndex: "serialNumber", key: "serialNumber" }, // New column
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (text, record) => (
        <img
          src={text}
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Email Address", dataIndex: "emailAddress", key: "emailAddress" },
    {
      title: "Rejection Reason",
      dataIndex: "rejecteReason",
      key: "rejecteReason",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <span className="flex gap-[10px]">
          <Button
            className="bg-[#0f7230] !text-white "
            onClick={() => handleActivate(record.id)}
          >
            accept
          </Button>
          <Button
            className="bg-[#f5222d] !text-white "
            onClick={() => {
              handleRejectModalOpen(record.id);
            }}
          >
            Reject
          </Button>
          <Modal
            title="Reject Doctor"
            visible={rejectModalVisible}
            onCancel={() => setRejectModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="reject"
                type="danger"
                onClick={() => {
                  handleRejectReason(selectedUserId);
                  handleReject(selectedUserId);
                }}
              >
                Reject
              </Button>,
            ]}
          >
            <Input
              placeholder="Enter rejection reason"
              value={rejecteReason}
              onChange={(e) => setRejecteReason(e.target.value)}
            />
          </Modal>
        </span>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between pl-[20px] pr-[20px] items-center mt-[20px] mb-[20px]">
        <h1 className="pharmacy-Requests">Pharmacy Requests</h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Search "
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataSourceWithSerial}
      />
    </div>
  );
};

export default RequestPharmacy;
