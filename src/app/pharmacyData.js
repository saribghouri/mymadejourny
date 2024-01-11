import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Table, message } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const PharmacyData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [Pharmacies, setPharmacies] = useState([]);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
          "https://mymedjournal.blownclouds.com/api/fatch/all/Pharmacies",
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
          setPharmacies(data.all_pharmacies);
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

  const handleDelete = async (userId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        
        message.success("pharmacy delete successfully");

        setPharmacies((prevPharmacies) =>
          prevPharmacies.filter((pharmacy) => pharmacy.id !== userId)
        );
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
      render: (isActives, record) => (
        <span>{isActives === "1" ? "Active" : "inacitve"}</span>
      ),
    },
    {
      title: "Approval",
      dataIndex: "isAprovel",
      key: "isAprovel",
      render: (isAprovel, record) => (
        <>
          <span className={isAprovel === "1" ? "accept" : "reject"}>
            {isAprovel === "1" ? "Accept" : "Reject"}
          </span>
        </>
      ),
    },
    {
      title: "Delete",
      dataIndex: "id",
      key: "delete",
      render: (id) => (
        <DeleteOutlined className="text-[#990e0e] ml-[10px]" type="link" danger onClick={() => handleDelete(record.id)}/>

      ),
    },

    {
      title: "Edit",
      dataIndex: "id",
      key: "edit",
      render: (id, record) => (
        <EditOutlined type="link" onClick={() => handleEdit(record)} />
      ),
    },
  ];
  const handleEdit = (doctor) => {
    setSelectedPharmacy(doctor);
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/users/edituser`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("User edited successfully");
        setPharmacies((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === selectedPharmacy.id
              ? { ...doctor, ...values }
              : doctor
          )
        );
      } else {
        console.error("Failed to edit user");
      }
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between pl-[20px] pr-[20px] items-center mt-[20px] mb-[20px]">
        <h1 className="Register-Pharmacy">Register Pharmacy</h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Input search text"
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {/* {loading ? (
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
      )} */}

      {Pharmacies && Pharmacies.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredPharmacies.map((Pharmacies) => ({
            ...Pharmacies,
            key: Pharmacies.id,
          }))}
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

      <Modal
        open={isModalVisible}
        title="Edit Pharmacy"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="custom-modal"
      >
        <EditUserForm doctor={selectedPharmacy} onSave={handleSave} />
      </Modal>
    </div>
  );
};
const EditUserForm = ({ doctor, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(doctor);
  }, [doctor, form]);

  return (
    <Form form={form} layout="vertical" onFinish={(values) => onSave(values)}>
      <label className="mb-[5px] font-semi-bold text-[#868585]">UserName</label>
      <Form.Item name="userName" rules={[{ required: true }]}>
        <Input className="border" placeholder="userName" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585]">
        AffiliationNo
      </label>
      <Form.Item name="affiliationNo" rules={[{ required: true }]}>
        <Input className="border" placeholder="affiliationNo" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585]">
        Experience
      </label>
      <Form.Item name="noOfExperience" rules={[{ required: true }]}>
        <Input className="border" placeholder="noOfExperience" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585]">
        Specialization
      </label>
      <Form.Item name="specialization" rules={[{ required: true }]}>
        <Input className="border" placeholder="specialization" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585]">Age</label>
      <Form.Item name="age" rules={[{ required: true }]}>
        <Input className="border" placeholder="age" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585]">Gender</label>
      <Form.Item name="gender" rules={[{ required: true }]}>
        <Input className="border" placeholder="gender" />
      </Form.Item>

      <Form.Item>
        <Button className="bg-[#2361dd] text-white" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PharmacyData;
