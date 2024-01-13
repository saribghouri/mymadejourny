import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

import { TimePicker } from "antd";

import Cookies from "js-cookie";
const AddAppointment = () => {
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});

  const onFinish = async (values) => {
    try {
      const requestBody = {
        appointmentday: values.appointmentday,
        appointmenttime: values.appointmentTime
          .map((time) => time.format("HH:mm"))
          .join(" to "),
      };
      const token = Cookies.get("apiToken");
  
      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (response.ok) {
        const jsonResponse = await response.json(); 
        message.success("Appointment added successfully");
        console.log("Appointment added successfully", jsonResponse);
      } else {
        const errorResponse = await response.json(); 
        message.error("Appointment creation failed", errorResponse);
      }
    } catch (error) {
      message.error("Error occurred", error.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex  items-center  justify-center flex-col h-[400px]  ">
      <h1 className="  text-[#2361dd] flex justify-start text-start items-start w-[370px] mb-[20px] font-bold text-[20px]">Add Appointment</h1>
      <Form className="bg-[#c2dff7] rounded-[10px] p-[20px] max-w-[800px] h-[250px]  flex flex-col justify-center items-center"
        form={form}
        name="addAppointmentForm"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinishFailed={onFinishFailed}
        initialValues={initialData}
        
      >
        <Form.Item
          // label="Appointment day"
          name="appointmentday"
          rules={[{ required: true, message: "Please enter Appointment day!" }]}
        >
          <Input placeholder="Appointment day"   className="w-[350px]"/>
        </Form.Item>

        <Form.Item
          // label="Appointment Time"
          name="appointmentTime"
          rules={[
            { required: true, message: "Please select appointment time!" },
          ]}
        >
          <TimePicker.RangePicker
            className="w-[350px]"
            format="HH:mm"
            minuteStep={15}
            // renderExtraFooter={() => " to "}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 18, span: 18 }}>
          <Button  className="bg-[#2361dd] text-white flex justify-end" htmlType="submit">
            Add Appointment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddAppointment;
