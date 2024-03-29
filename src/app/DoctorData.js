"use client";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Table, Modal, Form, Button, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const DoctorData = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const filteredDoctor = doctors
    ? doctors.filter((doctor) =>
        doctor.userName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/fatch/doctor",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    // {
    //   title: "Status",
    //   dataIndex: "isActives",
    //   key: "isActives",
    //   render: (isActives) => (
    //     <span>{isActives === "1" ? "Active" : "Inactive"}</span>
    //   ),
    // },
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
      title: "Approval",
      dataIndex: "isAprovel",
      key: "isAprovel",
      render: (isAprovel) => (
        <span className={isAprovel === "1" ? "accept" : "reject"}>
          {isAprovel === "1" ? "Accept" : "Reject"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <div>
          <EditOutlined
            className="text-[#2361dd] text-[18px] "
            type="link"
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined
              className="text-[#990e0e] ml-[10px] text-[18px]"
              type="link"
              danger
            />
          </Popconfirm>

        
          <EyeOutlined
            className="text-[#1f9c40] ml-[10px] text-[18px]"
            type="link"
            onClick={() => handleView(record)}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      const token = Cookies.get("apiToken");
      const userId = selectedDoctor.id;

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/users/edituser/${userId}`,
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
   
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === selectedDoctor.id ? { ...doctor, ...values } : doctor
          )
        );
        message.success("User edited successfully");
        setLoading(false);
      } else {
        console.error("Failed to edit user");
        message.error("Failed to edit user");
      }
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

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
        message.success("Doctor deleted successfully");
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.id !== userId)
        );
      } else {
        console.error("Failed to delete user");
        message.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalVisible(true);
  };
  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[20px] mb-[20px]">
        <h1 className="Doctors">Doctors</h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Search"
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {doctors && doctors.length > 0 ? (
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSourceWithSerial}
        />
      ) : (
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSourceWithSerial}
        />
      )}

      <Modal
        open={isModalVisible}
        title="Edit Doctor"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="custom-modal"
      >
        <EditUserForm doctor={selectedDoctor} onSave={handleSave} />
      </Modal>

      <Modal
        width={300}
        open={isViewModalVisible}
        title="View Doctor"
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        className="custom-modal text-center mb-[20px]"
      >
        {selectedDoctor && (
          <div className="w-full justify-center flex flex-col items-center">
            {selectedDoctor.profileImage && (
              <img
                className="flex justify-center  w-[100px] h-[100px] object-cover items-center rounded-[50%]"
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

            <div className="flex flex-col gap-[20px] mt-[20px]">
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[110px] font">Name:</span>
                <p> {selectedDoctor.userName}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[50px] ">Email:</span>
                <p> {selectedDoctor.emailAddress}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[80px] ">Experience:</span>
                <p>{selectedDoctor.noOfExperience}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px] ">Specialization:</span>
                <p>{selectedDoctor.specialization}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px] ">age:</span>
                <p>{selectedDoctor.age}</p>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px] ">affiliationNo:</span>
                <p>{selectedDoctor.affiliationNo} </p>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px] ">Categories:</span>
                <p>{selectedDoctor.doctorCategoryName} </p>
              </p>
            </div>
          </div>
        )}
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
      <label className="mb-[5px] font-semi-bold text-[#868585] font ">UserName</label>
      <Form.Item name="userName" rules={[{ required: true }]}>
        <Input className="border" placeholder="userName" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585] font">
        AffiliationNo
      </label>
      <Form.Item name="affiliationNo" rules={[{ required: true }]}>
        <Input className="border" placeholder="affiliationNo" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585] font">
        Experience
      </label>
      <Form.Item name="noOfExperience" rules={[{ required: true }]}>
        <Input className="border" placeholder="noOfExperience" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585] font">
        Specialization
      </label>
      <Form.Item name="specialization" rules={[{ required: true }]}>
        <Input className="border" placeholder="specialization" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585] font">Age</label>
      <Form.Item name="age" rules={[{ required: true }]}>
        <Input className="border" placeholder="age" />
      </Form.Item>
      <label className="mb-[5px] font-semi-bold text-[#868585] font">Gender</label>
      <Form.Item name="gender" rules={[{ required: true }]}>
        <Input className="border" placeholder="gender" />
      </Form.Item>

      <Form.Item>
        <Button
          className="bg-[#2361dd] !text-white text-center"
          htmlType="submit"
          // loading={loadingUpdateProfile}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DoctorData;
