import {
  EyeOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Table } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const ActivePharmacy = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [Pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredPharmacies = Pharmacies
    ? Pharmacies.filter((pharmacy) =>
        pharmacy.userName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/active/fatch/Pharmacies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          console.log("Pharmacies fetched successfully:", data);
          setPharmacies(data.active_Pharmacie);
        } else {
          console.error("Failed to fetch pharmacies. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const datas = Array.isArray(Pharmacies)
    ? Pharmacies.map((Pharmacies) => ({
        key: Pharmacies.id.toString(),
        id: Pharmacies.id,
        userRole: Pharmacies.userRole,
        doctorCategories: Pharmacies.doctorCategories,
        pharmacieName: Pharmacies.pharmacieName,
        emailAddress: Pharmacies.emailAddress,
      }))
    : [];
  console.log("data", datas);
  const handleView = (doctor) => {
    setSelectedPharmacies(doctor);
    setModalVisible(true);
  };
  const handleActivatePharmacy = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/active/fatch/Pharmacies?userId=${userId}&isActives=active`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
      if (response.ok) {
        const updatedPharmacies = Pharmacies.map((Pharmacies) =>
          Pharmacies.id === userId
            ? { ...Pharmacies, isActives: "1" }
            : Pharmacies
        );
        setPharmacies(updatedPharmacies);
      } else {
        console.error("Error activating Pharmacies. Status:", response.status);
      }
    } catch (error) {
      console.error("Error activating Pharmacies:", error);
    }
  };

  const handleDeactivatePharmacy = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/active/fatch/Pharmacies?userId=${userId}&isActives=inactive`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);

      if (response.ok) {
        const updatedPharmacies = Pharmacies.map((Pharmacies) =>
          Pharmacies.id === userId
            ? { ...Pharmacies, isActives: "0" }
            : Pharmacies
        );
        setPharmacies(updatedPharmacies);
      } else {
        console.error(
          "Error deactivating Pharmacies. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deactivating Pharmacies:", error);
    }
  };
  const dataSourceWithSerial = filteredPharmacies.map(
    (pharmacyData, index) => ({
      ...pharmacyData,
      key: pharmacyData.id,
      serialNumber: index + 1,
    })
  );
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
      title: "Status",
      dataIndex: "isActives",
      key: "isActives",
      render: (_, record) => (
        <>
          {record.isActives === "1" ? (
            <Button
              className="bg-[#a4a5a5] text-white"
              onClick={() => handleDeactivatePharmacy(record.id)}
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="bg-[#148644] text-white"
              onClick={() => handleActivatePharmacy(record.id)}
            >
              Active
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <div>
          {/* <EditOutlined
            className="text-[#2361dd] "
            type="link"
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            className="text-[#990e0e] ml-[10px]"
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          /> */}
          <EyeOutlined
            className="text-[#1f9c40] ml-[10px] text-[18px]"
            type="link"
            onClick={() => handleView(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between pl-[20px] pr-[20px] items-center mt-[10px] mb-[20px]">
        <h1 className="Active-Pharmacy">Active Pharmacy</h1>
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
        dataSource={dataSourceWithSerial.map((Pharmacies) => ({
          ...Pharmacies,
          key: Pharmacies.id,
        }))}
      />
      <Modal
        width={300}
        open={modalVisible}
        title="View Pharmacy"
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="custom-modal text-center"
      >
        {selectedPharmacies && (
          <div className="w-full justify-center flex flex-col items-center">
            {selectedPharmacies.profileImage && (
              <img
                className="flex justify-center  w-[100px] h-[100px] object-cover items-center rounded-[50%]"
                src={selectedPharmacies.profileImage}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  marginBottom: 10,
                }}
                alt="Profile"
              />
            )}
            <div className="flex flex-col gap-[20px] mt-[20px]">
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[110px]">Name:</span>
                <p> {selectedPharmacies.userName}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[50px]">Email:</span>
                <p> {selectedPharmacies.emailAddress}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px]">age:</span>
                <p>{selectedPharmacies.age}</p>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px]">affiliationNo:</span>
                <p>{selectedPharmacies.affiliationNo} </p>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivePharmacy;
