
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Table, Modal, Form, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const DoctorData = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  
  const filteredDoctor = doctors ? doctors.filter((doctor) =>
  doctor.userName.toLowerCase().includes(searchText.toLowerCase())
) : [];
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
      render: (isActives) => (
        <span>{isActives === "1" ? "Active" : "Inactive"}</span>
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
            className="text-[#2361dd] "
            type="link"
            onClick={() => handleEdit(record)}
          />
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
        console.log("User edited successfully");
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === selectedDoctor.id ? { ...doctor, ...values } : doctor
          )
        );
        message.success("User edited successfully");
        setLoading(false)
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
        message.success("doctor delete successfully");

        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.id !== userId)
        );
      } else {
        console.error("Failed to delete user");
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
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[10px] mb-[20px]">
        <h1 className="Doctors">Doctors</h1>
        <Input
          className="w-[300px] rounded-[40px]"
          placeholder="Input search text"
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
        <Button
          className="bg-[#2361dd] text-white"
          htmlType="submit"
          loading={loadingUpdateProfile}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DoctorData;
