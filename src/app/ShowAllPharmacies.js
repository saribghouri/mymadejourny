"use client";

import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Spin, Table } from "antd";

import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import Image from "next/image";
const ShowAllPharmacies = () => {
  const [searchText, setSearchText] = useState("");
  const API_URL = "https://mymedjournal.blownclouds.com/api/Pharmacies";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [pharmacies, setpharmacies] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingpharmacie, setEditingpharmacie] = useState(null);
  const filteredPharmacies = pharmacies.filter((pharmacy) =>
  pharmacy.pharmacieName.toLowerCase().includes(searchText.toLowerCase())
);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setpharmacies(data["All pharmacies"].data);
        } else {
          console.error("Failed to fetch Pharmacies");
        }
      } catch (error) {
        console.error("Error fetching Pharmacies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pharmacie = pharmacies.map((pharmacie) => ({
    key: pharmacie.id ? pharmacie.id.toString() : "",
    id: pharmacie.id || "",
    pharmacieImage: pharmacie.pharmacieImage || "",
    pharmacieName: pharmacie.pharmacieName || "",
    pharmacieDetail: pharmacie.pharmacieDetail || "",
    userId: pharmacie.userId || "",
  }));
  
  console.log("data", pharmacie);
  console.log("data", pharmacie);
  const handleAdd = () => {
    setEditingpharmacie(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (id) => {
    const pharmacieToEdit = pharmacie.find((pharmacie) => pharmacie.id === id);
    setEditingpharmacie(pharmacieToEdit);
    form.setFieldsValue(pharmacieToEdit);
    setVisible(true);
  };

  const handleDelete = async (id, userIds) => {
    console.log("userId", userIds);
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/Pharmacies`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (response.ok) {
        const updatedPharmacies = pharmacies.filter(
          (pharmacy) => pharmacy.id !== id
        );
        setpharmacies(updatedPharmacies);
      } else {
        console.error("Error deleting pharmacy. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    fetchData();
  };

  const handleSave = async (values) => {
    try {
      const token = Cookies.get("apiToken");
      let response;

      if (editingpharmacie) {
        response = await fetch(
          `https://mymedjournal.blownclouds.com/api/Pharmacies/${values.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
      } else {
        response = await fetch(
          "https://mymedjournal.blownclouds.com/api/Pharmacies",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
      }

      if (response.ok) {
        const data = await response.json();
        const updatedPharmacies = editingpharmacie
          ? pharmacies.map((pharmacy) =>
              pharmacy.id === values.id ? { ...pharmacy, ...values } : pharmacy
            )
          : [...pharmacies, data];

        setpharmacies(updatedPharmacies);
        form.resetFields();
        setVisible(false);
      } else {
        console.error("Error saving pharmacy. Status:", response.status);
      }
    } catch (error) {
      console.error("Error saving pharmacy:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Profile",
      dataIndex: "pharmacieImage",
      key: "pharmacieImage",
      render: (pharmacieImage) => (
        <img
          className="pharmacy-img"
          src={pharmacieImage}
          alt="Pharmacie Image"
        />
      ),
    },
    {
      title: "pharmacieName",
      dataIndex: "pharmacieName",
      key: "pharmacieName",
    },
    {
      title: "pharmacieDetail",
      dataIndex: "pharmacieDetail",
      key: "pharmacieDetail",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <span className="flex gap-[10px]">
          <Button
            className="bg-[#1d8dd8] !text-[#fff] "
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button className="bg-[#751010] !text-[#fff] " type="danger">
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] items-center mt-[10px] mb-[20px]">
        <h1>pharmacies</h1>
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
          dataSource={filteredPharmacies.map((pharmacy) => ({
            ...pharmacy,
            key: pharmacy.id,
          }))}
        />
      )}
      <Modal
        title={editingpharmacie ? "Edit Doctor" : "Add Doctor"}
        open={visible}
        onCancel={handleCancel}
        onOk={form.submit}
      >
        <Form
          form={form}
          onFinish={handleSave}
          initialValues={editingpharmacie}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="pharmacieName"
            rules={[{ required: true, message: "Please enter pharmacieName" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pharmacieDetail"
            rules={[
              { required: true, message: "Please enter pharmacieDetail" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowAllPharmacies;
