"use client";
import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  theme,
  Input,
  Dropdown,
  Space,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOutlined,
  ContainerOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DownOutlined,
  InfoOutlined,
  LayoutOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import AddDoctor from "../AddDoctor";
import DoctorData from "../DoctorData";
import AddPharmacy from "../AddPharmacy";

import ShowPharmacies from "../ShowPharmacies";
import Cookies from "js-cookie";
import PharmacyData from "../pharmacyData";
import ShowAllPharmacies from "../ShowAllPharmacies";

const { Header, Sider } = Layout;

const App = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPharmacy, setShowAddPharmacy] = useState(false);
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [ShowPharmacie, setShowPharmacies] = useState(false);
  const [allPharmacies, setAllPharmacies] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [form] = Form.useForm();
  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleShowPharmacyData = () => {
    setShowPharmacy(true);
    setShowPharmacies(false);
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowDoctor(false);
    setAllPharmacies(false);
  };
  const handleShowAllPharmacies = () => {
    setAllPharmacies(true);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowDoctor(false);
  };
  const handleShowPharmacies = () => {
    setShowPharmacies(true);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowDoctor(false);
  };

  const handleShowDoctorData = () => {
    setShowDoctor(true);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
  };
  const handleAddPharmacy = () => {
    setShowAddPharmacy(true)
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setShowAddDoctor(false);
    // setShowAddPharmacy(false);
  };

  const handleClick = (component) => {
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowPharmacy(false);
    setShowDoctor(false);

    if (component === "doctor") {
      setShowAddDoctor(true);
    } else if (component === "pharmacy") {
      setShowAddPharmacy(true);
    }
  };
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
        setLoading(false);

        setShowAllPharmacies(true);
        setShowPharmacy(false);
        setShowAddDoctor(false);
        setShowAddPharmacy(false);
        setShowDoctor(false);

        handleOk();
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
  const userName = localStorage.getItem("data");
  const userId = localStorage.getItem("userRole");
  console.log(userId);
  const cleanedUserName = userName.replace(/"/g, "");

  console.log("qaebqeb", cleanedUserName);

  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  function getItem(label, key, icon, children, onClick) {
    return {
      key,
      icon,
      children,
      label,
      onClick,
    };
  }
  const handleclick = () => {
    setLoading(true);
  };
  const getUserRole = () => {
    const userName = localStorage.getItem("data");
    const cleanedUserName =
      userName !== null ? userName.replace(/"/g, "") : userName;

    const userId = localStorage.getItem("userRole");
    console.log("userId", userId);

    if (cleanedUserName.includes("admin")) {
      return "1";
    } else if (cleanedUserName.includes("doctor")) {
      return "3";
    } else if (cleanedUserName.includes("pharmacy")) {
      return "4";
    } else if (userId.includes("3")) {
      return "3";
    } else if (userId.includes("4")) {
      return "4";
    }
  };

  const generateMenuItems = () => {
    const userRole = getUserRole();

    if (userRole === "1") {
      console.log("sabgqebew");
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("Pages", "sub1", <BookOutlined />, [
          getItem("Tom", "1"),
          getItem("Bill", "2"),
          getItem("Alex", "3"),
        ]),
        getItem("Doctor", "sub2", <TeamOutlined />, [
          getItem(
            <>
              <button onClick={handleShowDoctorData}> Show Doctors</button>
            </>
          ),
          getItem(
            <>
              <button onClick={() => handleClick("doctor")}> Add Doctor</button>
            </>
          ),
        ]),
        getItem("Pharmacy", "sub", <TeamOutlined />, [
          getItem(
            <>
              <button onClick={handleShowPharmacyData}>Show Pharmacy</button>
            </>
          ),
          getItem(
            <>
              <button onClick={handleShowAllPharmacies}>Show Pharmacies</button>
            </>
          ),
          getItem(
            <>
              <button onClick={handleAddPharmacy}>
                {" "}
                Add Pharmacy
              </button>
            </>
          ),
        ]),
        getItem("Layout", "20", <LayoutOutlined />),
        getItem("Components"),
        getItem("Basic UI", "sub3", <ContainerOutlined />, [
          getItem("Tom", "5"),
          getItem("Bill", "6"),
          getItem("Alex", "7"),
        ]),
        getItem("Extended UI", "sub4", <DeploymentUnitOutlined />, [
          getItem("Tom", "8"),
          getItem("Bill", "9"),
          getItem("Alex", "10"),
        ]),
        getItem("Icons", "sub5", <InfoOutlined />, [
          getItem("Tom", "11"),
          getItem("Bill", "12"),
          getItem("Alex", "13"),
        ]),
        getItem("Chart ", "sub6", <PieChartOutlined />, [
          getItem("Tom", "14"),
          getItem("Bill", "15"),
          getItem("Alex", "16"),
        ]),
      ];
    } else if (userRole === "3") {
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("doctordata", "sub14", <TeamOutlined />, [
          getItem(
            <>
              <a>Add appointment</a>
            </>
          ),
          getItem(
            <>
              <a>Show ap</a>
            </>
          ),
        ]),
      ];
    } else if (userRole === "4") {
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("pharmacy", "sub2", <TeamOutlined />, [
          getItem(
            <>
              <button onClick={showModal}> Add Pharmacies</button>
            </>
          ),
          getItem(
            <>
              <button onClick={handleShowPharmacies}> Show Pharmacies </button>
            </>
          ),
        ]),
      ];
    } else {
      return [getItem("Dashboard ", "1", <DashboardOutlined />)];
    }
  };

  const item = generateMenuItems();

  const items = [
    {
      key: "1",
      label: (
        <Link to="/account">
          <UserOutlined /> My Account
        </Link>
      ),
    },

    {
      key: "2",

      label: (
        <Link to="/account">
          <SettingOutlined /> Settings
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="/account">
          <CustomerServiceOutlined /> Change Password
        </Link>
      ),
      onClick: handleShowChangePasswordModal,
    },
    {
      key: "3",

      label: (
        <Link
          onClick={() => {
            router.push("/");
          }}
          to="/account"
        >
          <LogoutOutlined />
          Logout
        </Link>
      ),
    },
  ];

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
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Modal
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
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
                {
                  required: true,
                  message: "Please enter your pharmacy detail!",
                },
              ]}
            >
              <Input
                className="h-[40px] border"
                placeholder="pharmacy detail"
              />
            </Form.Item>

            <Form.Item
              className="h-[50px]"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              extra=" "
              rules={[
                {
                  required: true,
                  message: "Please upload your pharmacy image!",
                },
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
                onOk={handleOk}
                className={`bg-[#1b70a8] mt-[50px]  justify-end w-full h-[40px] !text-white text-[18px] text-center`}
                onClick={() => {
                  handleclick();
                }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Sider
        className=""
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="p-[30px] text-[22px] ">
          <h1 className="text-white text-center">
            <Image
              width={1000}
              height={1000}
              alt=""
              className=""
              src="/assserts/images/logo.png"
            />
          </h1>
        </div>
        <div className="demo-logo-vertical bg-[#fff]" />
        <Menu
          className=""
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={item}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center justify-between ">
            <div>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              {/* <Input
                className="w-[300px] rounded-[40px]"
                placeholder="Input search text"
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              /> */}
            </div>
            <div>
              <Modal
                title="Change Password"
                visible={showChangePasswordModal}
                onCancel={handleCloseChangePasswordModal}
                footer={null}
              >
                <Form
                  form={form}
                  name="changePasswordForm"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  {/* Add your form fields for old password, new password, confirm password, etc. */}
                  <Form.Item
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your old password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Old Password" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="New Password" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm Password" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <div className="flex text-center items-center">
                <Image
                  width={50}
                  height={50}
                  alt=""
                  className="w-[50px] h-[50px]"
                  src="/assserts/images/images.png"
                />
                <Dropdown
                  className="mr-[20px]"
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="text-[#39aabe]">
                      {cleanedUserName}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>
          </div>
        </Header>

        <div>
        
          <div>
            {ShowPharmacie && <ShowPharmacies />}
            
            <div className="flex flex-wrap gap-[10px] w-full items-center justify-center">
              {/* <Card className="bg-[#ee427b]" style={{ width: 370 }}>
              <p className="text-white">DAILY VISITS</p>
              <p className="text-white font-bold">8,652Card content</p>
              <p className="text-white">2.97% Since last month</p>
            </Card>
            <Card className="bg-[#7657c0]" style={{ width: 370 }}>
              <p className="text-white">REVENUE</p>
              <p className="text-white font-bold">$9,254.62</p>
              <p className="text-white">18.25% Since last month</p>
            </Card>
            <Card className="bg-sky-500" style={{ width: 370 }}>
              <p className="text-white">ORDERS</p>
              <p className="text-white font-bold">753</p>
              <p className="text-white">-5.75% Since last month</p>
            </Card>
            <Card className="bg-[#2cb6b6]" style={{ width: 370 }}>
              <p className="text-white">USERS</p>
              <p className="text-white font-bold">63,154</p>
              <p className="text-white">8.21% Since last month</p>
            </Card>
      */}
      
            </div>
          </div>

          {showAddDoctor && <AddDoctor />}
          {showAddPharmacy && <AddPharmacy />}
          {showPharmacy && <PharmacyData />}
       
        </div>
        <div>{showDoctor && <DoctorData />}</div>
        <div>

        {allPharmacies && <ShowAllPharmacies />}
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
