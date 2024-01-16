import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const ActiveDoctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  ;

  const filteredDoctor =
    doctors && doctors.length > 0
      ? doctors.filter((doctor) =>
          doctor.userName.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  console.log("doctors", doctors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/active/fatch/doctor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Doctors fetched successfully:", data);
          setDoctors(data.active_doctor);
        } else {
          console.error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };
  const handleActivateDoctor = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/active/fatch/doctor?userId=${userId}&isActives=active`,
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
        const updatedDoctors = doctors.map((doctor) =>
          doctor.id === userId ? { ...doctor, isActives: "1" } : doctor
        );
        setDoctors(updatedDoctors);
      } else {
        console.error("Error activating doctor. Status:", response.status);
      }
    } catch (error) {
      console.error("Error activating doctor:", error);
    }
  };

  const handleDeactivateDoctor = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/active/fatch/doctor?userId=${userId}&isActives=inactive`,
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
        const updatedDoctors = doctors.map((doctor) =>
          doctor.id === userId ? { ...doctor, isActives: "0" } : doctor
        );
        setDoctors(updatedDoctors);
      } else {
        console.error("Error deactivating doctor. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deactivating doctor:", error);
    }
  };
  const dataSourceWithSerial = filteredDoctor.map((doctorData, index) => ({
    ...doctorData,
    key: doctorData.id,
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
      title: "Status",
      dataIndex: "isActives",
      key: "isActives",
      render: (_, record) => (
        <>
          {record.isActives === "1" ? (
            <Button
              className="bg-[#a4a5a5] !text-white"
              onClick={() => handleDeactivateDoctor(record.id)}
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="bg-[#148644] !text-white"
              onClick={() => handleActivateDoctor(record.id)}
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
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[20px] mb-[20px]">
        <h1 className="Doctors">Doctors</h1>
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
        dataSource={dataSourceWithSerial.map((doctor) => ({
          ...doctor,
          key: doctor.id,
        }))}
      />
      <Modal
        width={300}
        open={modalVisible}
        title="View Doctor"
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="custom-modal"
      >
        {selectedDoctor && (
          <div className="flex justify-center flex-col w-full">
            {selectedDoctor.profileImage && (
              <img
                src={selectedDoctor.profileImage}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  marginBottom: 10,
                }}
                alt="Profile"
              />
            )}
            <div className="flex flex-col gap-[20px]">
              <p>
                <span className="font-bold mr-[110px]">Name:</span>
                {selectedDoctor.userName}
                <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[50px]">Email:</span>
                {selectedDoctor.emailAddress} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[80px]">Experience:</span>
                {selectedDoctor.noOfExperience} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[60px]">Specialization:</span>
                {selectedDoctor.specialization} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[130px]">Age:</span>
                {selectedDoctor.age} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[70px]">AffiliationNo:</span>
                {selectedDoctor.affiliationNo} <hr></hr>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActiveDoctors;
