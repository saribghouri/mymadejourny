import { Button, Form, Input, InputNumber, Select } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from 'js-cookie';
const AddPharmacy = () => {
  const router = useRouter();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    console.log(values);
    try {
      const requestBody = {
        emailAddress: values.emailAddress,
        password: values.password,
        username: values.username,

        userRole: values.userType,
        gender: values.gender,
      };
      const token = Cookies.get('apiToken');
      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("User registered successfully");
        router.push("/dashboard");
      } else {
        console.error("Registration failed:", response.statusText);
        console.log("Response:", response);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className=" border  bg-[#fff] w-[92%] mx-auto rounded-[10px] mb-[20px]">
      <div className="bg-[#1b70a8] justify-between flex items-center h-[100px] mb-[20px] rounded-t-[10px] w-[100%]">
        <h1 className="text-white font-bold text-[24px] ml-[20px]">
          Add Pharmacy
        </h1>
      </div>
      <Form
        className="pl-[50px] pr-[50px]"
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input className="h-[40px] border" placeholder="username" />
        </Form.Item>

        <Form.Item
          name="emailAddress"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input className="h-[40px] border" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input
            type="umber"
            className="h-[40px] border"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          className="w-[100%]"
          name={["user", "age"]}
          rules={[{ type: "number", min: 0, max: 99 }]}
        >
          <InputNumber className="w-[100%]" placeholder="affiliationNo" />
        </Form.Item>
        <Form.Item
          name="userType"
          rules={[
            {
              required: true,
              message: "Please enter affiliationNope!",
            },
          ]}
        >
          <Select placeholder="select role" className=" h-[40px]">
            <Select.Option type="admin" value={1}>
              Admin
            </Select.Option>
            <Select.Option type="Pharmacy" value={4}>
              Pharmacy
            </Select.Option>
            <Select.Option type="Doctor" value={3}>
              Doctor
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className={`bg-[#1b70a8] w-[250px] h-[40px] !text-white text-[18px] text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              handleClick();
            }}
            loading={loading}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPharmacy;
