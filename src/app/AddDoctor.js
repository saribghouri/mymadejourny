import {
  LoadingOutlined,
  LockOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";

import React, { useState } from "react";
import Image from "next/image";
import DoctorData from "./DoctorData";
const AddDoctor = () => {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);

  const [registrationResponse, setRegistrationResponse] = useState(null);
  console.log("DdbbeBNn", registrationResponse);
  const [isRegistrationSuccessful, setRegistrationSuccessful] = useState(false);
  const { Option } = Select;

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const onFinish = async (values) => {
    console.log(values);
    try {
      const requestBody = {
        emailAddress: values.emailAddress,
        password: values.password,
        userName: values.username,
        noOfExperience: parseInt(values.noOfExperience, 10),
        specialization: values.specialization,
        age: values.age,
        userRole: values.userRole,
        gender: values.gender,
        profileImage: values.upload[0]?.response?.data?.url,
        affiliationNo: values.affiliationNo,
        doctorCategories:values.doctorCategories
      };
      const token = "591|6874p2sbrm0NzgpDtJEq7i5ACngx2L9rYunpwkSvb0af41a5";
      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Doctor registered successfully");
        setRegistrationSuccessful(true);
        setRegistrationResponse(await response.json());
      } else {
        console.error("Doctor registration failed:", response.statusText);
        setRegistrationResponse(await response.json());
      }
    } catch (error) {
      console.error("Error during doctor registration:", error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (info) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        className="!w-[100%]"
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <div>
      {isRegistrationSuccessful ? (
        <DoctorData />
      ) : (
        <div className=" border  bg-[#fff] w-[92%] mx-auto rounded-[10px] mb-[20px]">
          <div className="bg-[#1b70a8] justify-between flex items-center h-[100px] mb-[20px] rounded-t-[10px] w-[100%]">
            <h1 className="text-white font-bold text-[24px] ml-[20px]">
              Add Doctor
            </h1>
          </div>

          <Form
            className="pl-[50px] pr-[50px]"
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="flex justify-between gap-[10px] mt-[60px]">
              <Form.Item
                className="w-[100%]"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                ]}
              >
                <Input className="h-[40px] border" placeholder="Username" />
              </Form.Item>
              <Form.Item
                className="w-[100%]"
                name="noOfExperience"
                rules={[
                  { required: true, message: "Please enter your Experience!" },
                ]}
              >
                <Input className="h-[40px] border" placeholder="Experience" />
              </Form.Item>
            </div>
            <div className="flex justify-between gap-[10px]">
              <Form.Item
                className="w-[100%]"
                name="emailAddress"
                rules={[
                  {
                    required: true,
                    message: "Please enter your emailAddress!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email emailAddress!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  className="h-[40px] border"
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                className="w-[100%]"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="umber"
                  className="h-[40px] border"
                  placeholder="Password"
                />
              </Form.Item>
            </div>

            <div className="flex justify-between gap-[10px]">
              <Form.Item
                className="w-[100%]"
                name="age"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 99,
                    required: true,
                    message: "Please enter your age!",
                  },
                ]}
              >
                <InputNumber className="!w-[100%] h-[40px]" placeholder="Age" />
              </Form.Item>
              <Form.Item
                className="w-[100%]"
                name="userRole"
                rules={[
                  {
                    required: true,
                    message: "Please select userRole!",
                  },
                ]}
              >
                <Select placeholder="Select Role" className=" h-[40px]">
                  <Select.Option type="admin" value={1}>
                    Admin
                  </Select.Option>
                  <Select.Option type="Pharmacy" value={2}>
                    Pharmacy
                  </Select.Option>
                  <Select.Option type="Doctor" value={3}>
                    Doctor
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="flex justify-between gap-[10px]">
              <Form.Item
                className="w-[100%]"
                name="specialization"
                rules={[
                  {
                    required: true,
                    message: "Please enter your specialization!",
                  },
                ]}
              >
                <Input
                  className="h-[40px] border"
                  placeholder="Specialization"
                />
              </Form.Item>
              <Form.Item
                className="w-[100%]"
                name="affiliationNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter your affiliationNo!",
                  },
                ]}
              >
                <Input
                  className="h-[40px] border"
                  placeholder="AffiliationNo"
                />
              </Form.Item>
            </div>

            <div className="flex justify-between gap-[10px]">
              <Form.Item
                className="w-[100%]"
                name="doctorCategories"
                rules={[
                  {
                    required: true,
                    message: "Please enter your doctorCategories!",
                  },
                ]}
              >
                <Input className="h-[40px] border" placeholder="Categories" />
              </Form.Item>
              <Form.Item
                className="w-[100%] h-[40px]"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder=" Gender">
                  <Option value="male">male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              className="h-[50px]"
              name="upload"
              valuePropName="value"
              extra=" "
              rules={[{ required: true, message: "Please upload image!" }]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader w-[100%]"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <Image width={100} height={100} src={imageUrl} alt="avatar" />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <div className=" flex justify-between mt-[80px]">
              <Form.Item>
                <Button
                  className="bg-[#881515] w-[150px] !text-white"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  cencel
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="bg-[#1b70a8] w-[150px] !text-white"
                  htmlType="submit"
                >
                  Add
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddDoctor;
