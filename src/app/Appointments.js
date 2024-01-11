import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState(null);
  const filteredDoctor = doctors
    ? doctors.filter((doctor) =>
        doctor.appointmentday.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  console.log("userId", userId);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditingAppointment(null);
    setEditModalVisible(false);
  };

  const handleEditSubmit = async (values) => {
    try {
      const clonedValues = JSON.parse(JSON.stringify(values));
  
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/appointment/${editingAppointment.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clonedValues),
        }
      );
  
      if (response.ok) {
        message.success("Appointment edited successfully");
        setDoctors((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === editingAppointment.id
              ? { ...appointment, ...clonedValues }
              : appointment
          )
        );
        setEditModalVisible(false);
      } else {
        console.error(
          "Failed to edit appointment:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error editing appointment:", error);
    }
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/user/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User details fetched successfully:", data);
          setUserId(data.user_details[0].id);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");

        if (userId) {
          const response = await fetch(
            `https://mymedjournal.blownclouds.com/api/appointment?doctor_id=${userId}`,
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
            if (
              data.appointment &&
              data.appointment[0] &&
              data.appointment[0].appointments
            ) {
              setDoctors(data.appointment[0].appointments);
            } else {
              console.error("Invalid data format:", data);
            }
          } else {
            console.error(
              "Failed to fetch doctors",
              response.status,
              response.statusText
            );
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  const handleDelete = async (appointmentId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/appointment/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        message.success("appointment delete successfully");
        setDoctors((prevappointment) =>
          prevappointment.filter(
            (appointment) => appointment.id !== appointmentId
          )
        );
      } else {
        console.error("Failed to delete category:", response.status);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "appointmentday",
      dataIndex: "appointmentday",
      key: "appointmentday",
    },
    {
      title: "Appointment time",
      dataIndex: "appointmenttime",
      key: "appointmenttime",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
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
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[10px] mb-[20px]">
        <h1 className="Appointment">Appointment</h1>
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
      <Modal
        title="Edit Appointment"
        visible={editModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>,
        ]}
      >
        <Form
          name="editAppointmentForm"
          initialValues={{ ...editingAppointment }}
          onFinish={handleEditSubmit}
        >
          <Form.Item name="appointmentday" label="Appointment Day">
            <Input />
          </Form.Item>
          <Form.Item name="appointmenttime" label="Appointment Time">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
