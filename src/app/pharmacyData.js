import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

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
  const handleView = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsViewModalVisible(true);
  };
  const columns = [
    { title: "Serial No", dataIndex: "serialNo", key: "serialNo" }, 
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
      title: "Action",
      dataIndex: "id",
      key: "delete",
      render: (id, record) => (
        <>
          <EditOutlined type="link" onClick={() => handleEdit(record)} />
          <DeleteOutlined
            className="text-[#990e0e] ml-[10px]"
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          />
          <EyeOutlined
            className="text-[#1f9c40] ml-[10px]"
            type="link"
            onClick={() => handleView(record)}
          />
        </>
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
      <Modal
        width={300}
        open={isViewModalVisible}
        title="View Doctor"
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        className="custom-modal"
      >
        {selectedPharmacy && (
          <div className="flex justify-center flex-col w-full">
            {selectedPharmacy.profileImage && (
              <img
                src={selectedPharmacy.profileImage}
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
                {selectedPharmacy.userName}
                <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[50px]">Email:</span>
                {selectedPharmacy.emailAddress} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[130px]">Age:</span>
                {selectedPharmacy.age} <hr></hr>
              </p>

              <p>
                <span className="font-bold mr-[70px]">AffiliationNo:</span>
                {selectedPharmacy.affiliationNo} <hr></hr>
              </p>
            </div>
          </div>
        )}
      </Modal>
      {Pharmacies && Pharmacies.length > 0 ? (
        <Table
        columns={columns}
        dataSource={filteredPharmacies.map((pharmacy, index) => ({
          ...pharmacy,
          serialNo: index + 1, 
          key: pharmacy.id,
        }))}
      />
      ) : (
        <Table
        columns={columns}
        dataSource={filteredPharmacies.map((pharmacy, index) => ({
          ...pharmacy,
          serialNo: index + 1, 
          key: pharmacy.id,
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
