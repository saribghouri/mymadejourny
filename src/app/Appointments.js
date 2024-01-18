import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {  DatePicker, Form, Input,  Modal,  Popconfirm,  Table, TimePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Appointments = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editAppointmentData, setEditAppointmentData] = useState({});
  const [form] = Form.useForm();

  const filteredDoctor = doctors
    ? doctors.filter((doctor) =>
        doctor.appointmentday.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  
  
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
        </div>
      ),
    },
  ];
  
  const handleEdit = (record) => {
    setEditModalVisible(true);
    setEditAppointmentId(record.id);
    setEditAppointmentData(record);
  };
  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/appointment/${editAppointmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.getFieldsValue()),
        }
      );
  
      if (response.ok) {
        message.success("Appointment updated successfully");
  
        setDoctors((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === editAppointmentId
              ? { ...appointment, ...form.getFieldsValue() }
              : appointment
          )
        );
  
        setEditModalVisible(false);
        form.resetFields();
      } else {
        console.error("Failed to update appointment:", response.status);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };
  
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
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} initialValues={editAppointmentData}>
          <Form.Item label="Appointment Day" name="appointmentday">
       <Input/>
          </Form.Item>
          <Form.Item label="Appointment Time" name="appointmenttime">
          <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
