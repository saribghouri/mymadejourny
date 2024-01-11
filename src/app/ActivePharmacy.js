import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Table } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const ActivePharmacy = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [Pharmacies, setPharmacies] = useState([]);

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
    //
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
      {loading ? (
        <Spin
          className="flex justify-center w-[100%] h-[200px] items-center"
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPharmacies.map((Pharmacies) => ({
            ...Pharmacies,
            key: Pharmacies.id,
          }))}
        />
      )}
    </div>
  );
};

export default ActivePharmacy;
