import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const ActiveDoctors = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const [searchText, setSearchText] = useState("");
  console.log("doctors", doctors);

  const filteredDoctor =
    doctors && doctors.length > 0
      ? doctors.filter((doctor) =>
          doctor.userName.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
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
        0.0;
        0.0;
        0.0;
        0.0;

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

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
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
        dataSource={filteredDoctor.map((doctor) => ({
          ...doctor,
          key: doctor.id,
        }))}
      />
    </div>
  );
};

export default ActiveDoctors;
