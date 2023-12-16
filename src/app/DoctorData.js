import {
  ConsoleSqlOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Table,
} from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const DoctorData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filteredDoctor = doctors.filter((doctors) =>
    doctors.userName.toLowerCase().includes(searchText.toLowerCase())
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/fatch/doctor",
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
          setDoctors(data.doctor);
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

  const datas = Array.isArray(doctors)
    ? doctors.map((doctor) => ({
        key: doctor.id.toString(),
        id: doctor.id,
        userRole: doctor.userRole,
        doctorCategories: doctor.doctorCategories,
        userName: doctor.userName,
        emailAddress: doctor.emailAddress,
      }))
    : [];
  console.log("data", datas);
  const handleAdd = () => {
    setEditingDoctor(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (id) => {
    const doctorToEdit = doctors.find((doctor) => doctor.id === id);
    setEditingDoctor(doctorToEdit);
    form.setFieldsValue(doctorToEdit);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Perform the API call to delete the doctor with the given ID
      // ...

      // Update the state after successful deletion
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
      setDoctors(updatedDoctors);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Perform the API call to update the status of the doctor with the given ID
      // ...

      // Update the state after successful status change
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, status: newStatus } : doctor
      );
      setDoctors(updatedDoctors);
    } catch (error) {
      console.error("Error changing doctor status:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = async (values) => {
    try {
      // Perform the API call to save or update the doctor
      // ...

      // Update the state after successful save or update
      const updatedDoctors = [...doctors];
      const index = updatedDoctors.findIndex(
        (doctor) => doctor.id === values.id
      );
      if (index === 1) {
        updatedDoctors[index] = values;
      } else {
        updatedDoctors.push(values);
      }
      setDoctors(updatedDoctors);

      setVisible(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
    }
  };
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Email Address", dataIndex: "emailAddress", key: "emailAddress" },
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
          {record.status === "active" ? (
            <Button
              className="bg-[#bebcbc]"
              onClick={() => handleStatusChange(record.id, "inactive")}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              className="bg-[#0f7230] !text-white"
              onClick={() => handleStatusChange(record.id, "active")}
            >
              Activate
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] items-center mt-[10px] mb-[20px]">
        <h1>Doctors</h1>
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
          dataSource={filteredDoctor.map((doctor) => ({
            ...doctor,
            key: doctor.id,
          }))}
        />
      )}
      <Modal
        title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
        visible={visible}
        onCancel={handleCancel}
        onOk={form.submit}
      >
        <Form form={form} onFinish={handleSave} initialValues={editingDoctor}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="userName"
            label="User Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailAddress"
            label="Email Address"
            rules={[{ required: true, message: "Please enter email address" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorData;
