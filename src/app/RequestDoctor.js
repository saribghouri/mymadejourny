import React, { useState, useEffect } from "react";
import { Button, Table, Input, Modal } from "antd";
import Cookies from "js-cookie";
import { SearchOutlined } from "@ant-design/icons";

const RequestDoctor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejecteReason, setRejecteReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [searchText, setSearchText] = useState("");

  const filteredDoctor = data
    ? data.filter((doctorData) =>
        doctorData.userName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  const userId = data[0]?.id;
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          `https://mymedjournal.blownclouds.com/api/inactive/fatch/doctor`,
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
    
          const doctorData = Array.isArray(responseData.inactive_doctor)
            ? responseData.inactive_doctor
            : [];

          setData(doctorData);
        } else {
          console.error(
            "Failed to fetch Doctor request. Status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching Doctor:", error);
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
        `https://mymedjournal.blownclouds.com/api/inactive/fatch/doctor?userId=${userId}&isAprovel=accept`,
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
        const updatedData = data.filter((doctor) => doctor.id !== userId);
        setData(updatedData);
 
      } else {
        console.error(
          "Failed credent to activate doctor. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error activating Doctor:", error);
    }
  };

  const handleRejectModalOpen = (userId) => {
    setSelectedUserId(userId);
    setRejectModalVisible(true);
  };

  const handleRejectReason = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/reject/reason/doctor?userId=${userId}&isAprovel=reject`,
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
        const updatedData = data.map((doctor) =>
          doctor.id === userId
            ? { ...doctor, rejecteReason: rejecteReason }
            : doctor
        );
 
        setData(updatedData);
        setRejectModalVisible(false);

      } else {
        console.error("Failed to reject doctor. Status:", response.status);
      }
    } catch (error) {
      console.error("Error rejecting Doctor:", error);
    }
  };
  const handleReject = async (userId) => {
    try {
      const token = Cookies.get("apiToken");

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/inactive/fatch/doctor?userId=${userId}&isAprovel=reject`,
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
        setRejecteReason("")

      } else {
        console.error("Failed to reject doctor. Status:", response.status);
      }
    } catch (error) {
      console.error("Error rejecting Doctor:", error);
    }
  };
  const dataSourceWithSerial = filteredDoctor.map((doctorData, index) => ({
    ...doctorData,
    key: doctorData.id,
    serialNumber: index + 1,
  }));
  const columns = [
    { title: "No", dataIndex: "serialNumber", key: "serialNumber" }, 

    { title: "Profile", dataIndex: "profileImage", key: "profileImage", render: (text, record) => <img src={text} style={{ width: 50, height: 50, borderRadius: '50%' }} /> },

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
                Rejects
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
        <h1 className="Doctor-Requests">Doctor Requests</h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Input search text"
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataSourceWithSerial.map((doctorData) => ({
          ...doctorData,
          key: doctorData.id,
          rejecteReason: doctorData.rejecteReason,
        }))}
      />
    </div>
  );
};

export default RequestDoctor;
