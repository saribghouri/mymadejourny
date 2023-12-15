import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React, { useState } from "react";

const AddPharmacies = () => {
  const [imageUrl, setImageUrl] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const router = useRouter();

  const onFinish = async (values) => {
    console.log(values);
    try {
      const token = Cookies.get("apiToken");
      const formData = new FormData();
      formData.append("pharmacieName", values.pharmacieName);
      formData.append("pharmacieDetail", values.pharmacieDetail);
      formData.append("pharmacieImage", values.upload[0]?.originFileObj);

      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/Pharmacies",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Pharmacie added successfully");
        setLoading(false)
        router.push("/dashboard");
      } else {
        message.error("Pharmacie not added");
        console.log("Response:", response);
      }
    } catch (error) {
      console.error("Error during adding pharmacy:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleClick = () => {
    setLoading(true);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }

    return true;
  };

  const uploadButton = (
    <div>
      {<PlusOutlined />}
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

  const handleChange = (info) => {
    if (info.file.status === "done") {
      console.log("Upload Response:", info.file.response);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <div>
      <div className="flex mb-[20px]">
        <h1 className="text-[24px] font-bold">Add pharmacies</h1>
      </div>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="pharmacieName"
          rules={[
            { required: true, message: "Please enter your pharmacyname!" },
          ]}
        >
          <Input className="h-[40px] border" placeholder="pharmacy name" />
        </Form.Item>
        <Form.Item
          name="pharmacieDetail"
          rules={[
            { required: true, message: "Please enter your pharmacy detail!" },
          ]}
        >
          <Input className="h-[40px] border" placeholder="pharmacy detail" />
        </Form.Item>

        <Form.Item
          className="h-[50px]"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          extra=" "
          rules={[
            { required: true, message: "Please upload your pharmacy image!" },
          ]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader w-[100%]"
            showUploadList={false}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            onChange={handleChange}
          >
            {imageUrl && typeof imageUrl === "string" ? (
              <Image width={100} height={100} src={imageUrl} alt="avatar" />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
          loading={loading}
            htmlType="submit"
            className={`bg-[#1b70a8] mt-[50px]  justify-end w-full h-[40px] !text-white text-[18px] text-center`}
            onClick={() => {
              handleClick();
            }}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPharmacies;
