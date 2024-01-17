"use client";
import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import Link from "antd/es/typography/Link";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
const Login = () => {
  console.log("Cookies", Cookies);

  const router = useRouter();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: values.email,
            password: values.password,
            userRole: values.userType,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        const cookie = Cookies.set("apiToken", data.access_token);
        console.log(cookie);

        const { userType } = values;

        switch (userType) {
          case 1:
          case 4:
          case 3:
            router.push("/dashboard");
            break;
          default:
            console.error("Invalid user role:", userType);
            break;
        }
      } else {
        const errorData = await response.json();
        console.error("API request failed:", errorData);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <main className=" flex min-h-screen flex-row items-center justify-between ">
      <div
        className=" bg-cover w-[100%] rounded-tr-[10px] rounded-br-[10px] absolute top-0 left-0"
        style={{}}
      >
        <div
          className="bg-[#2361dd] min-h-screen w-[50%]  rounded-tr-[10px] rounded-br-[10px] relative"
          style={{
            backgroundImage: `url("/assserts/images/bg.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <h1 className="text-white text-center flex justify-center items-center min-h-screen">
        <Image
          width={400}
          height={400}
          alt=""
          className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
          src="/assserts/images/logo-white.png"
        />
      </h1>
      <div className="bg-[#d8e4f5] shadow-[rgba(0,0,0,0.1)] gap-[20px] rounded-[20px] h-[500px] text-center flex flex-col w-[400px] mr-[40px]">
        <div className="bg-[#2361dd] rounded-t-[20px] w-[400px] h-[400px] flex items-center justify-center">
          <h1 className="text-[30px] font-bold text-white"> Login</h1>
        </div>

        <div className=" p-6 gap-[40px] rounded-[20px] h-[500px] text-center flex flex-col w-[330px] mx-auto">
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="email"
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
              <Input
                className="h-[40px] border "
                prefix={<UserOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                type="umber"
                className="h-[40px] border mb-[-15px]"
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="userType"
              rules={[
                {
                  required: true,
                  message: "Please select a user type!",
                },
              ]}
            >
              <Select placeholder="select role" className="mt-[20px] h-[40px]">
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
            <Form.Item>
              <Button
                htmlType="submit"
                className={`bg-[#2361dd] w-full h-[40px] !text-white text-[18px] text-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  handleClick();
                }}
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link>forgot passowrd?</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
