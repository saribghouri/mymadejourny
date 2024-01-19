import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const Users = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log("selectedDoctor", selectedDoctor)
  console.log(doctors)
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
          "https://mymedjournal.blownclouds.com/api/all/user/fetch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          setDoctors(data.all_users["data"]);
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
        `https://mymedjournal.blownclouds.com/api/all/user/fetch?userId=${userId}&isActives=active`,
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
        `https://mymedjournal.blownclouds.com/api/all/user/fetch?userId=${userId}&isActives=inactive`,
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
      key: "delete",
      render: (id, record) => (
        <>
          <EditOutlined
            className="text-[18px] text-[#2361dd]"
            type="link"
            onClick={() => handleEdit(record)}
          />
            <Popconfirm
            title="Are you sure you want to delete this pharmacy?"
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
        </>
      ),
    },
    
  ];
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
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== userId);
      setDoctors(updatedDoctors);
    } else {
      console.error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
const handleEdit = (doctor) => {
  setSelectedDoctor(doctor);
  setIsModalVisible(true);
};

const handleSave = async (values) => {
  try {
    
    const token = Cookies.get("apiToken");
    const userId = selectedDoctor.id;
console.log("userId",userId)
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

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[20px] mb-[20px]">
        <h1 className="Doctors"> Users </h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Search"
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
        title="Users"
        onCancel={() => setModalVisible(false)}
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
                <span className="font-bold mr-[110px]">Name:</span>
                <p> {selectedDoctor.userName}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[50px]">Email:</span>
                <p> {selectedDoctor.emailAddress}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[80px]">Phone No:</span>
                <p>{selectedDoctor.phoneNo}</p>
              </p>


              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px]">Age:</span>
                <p>{selectedDoctor.age}</p>
              </p>
             
          
            </div>
          </div>
        )}
      </Modal>
      <Modal
  open={isModalVisible}
  title="Edit Doctor"
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  className="custom-modal"
>
  <EditUserForm doctor={selectedDoctor} onSave={handleSave} />
</Modal>
    </div>
  );
};
const EditUserForm = ({ doctor, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(doctor); 
    form.setFieldsValue(doctor);
  }, [doctor, form]);

  return (
    <Form form={form} layout="vertical" onFinish={(values) => {
      console.log("Form Values:", values); 
      onSave(values);
    }}>
      <label className="mb-[5px] font-semi-bold text-[#868585] font ">UserName</label>
      <Form.Item name="userName" rules={[{ required: true }]}>
        <Input className="border" placeholder="userName" />
      </Form.Item>
     
     
      <label className="mb-[5px] font-semi-bold text-[#868585] font">
        Phone No
      </label>
      <Form.Item name="phoneNo" rules={[{ required: true }]}>
        <Input className="border" placeholder="PhoneNo" />
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
          className="bg-[#2361dd] text-white text-center"
          htmlType="submit"
          // loading={loadingUpdateProfile}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Users;
