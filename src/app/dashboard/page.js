"use client";
import React, { useEffect, useState } from "react";
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
  message,
  Upload,
  Card,
} from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DownOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DoctorData from "../DoctorData";
import ShowPharmacies from "../ShowPharmacies";
import Cookies from "js-cookie";
import ShowAllPharmacies from "../ShowAllPharmacies";
import AddAppointment from "../AddAppointment";
import RequestDoctor from "../RequestDoctor";
import RequestPharmacy from "../RequestPharmacy";
import ActiveDoctors from "../ActiveDoctors";
import PharmacyData from "../pharmacyData";
import ActivePharmacy from "../ActivePharmacy";
import Appointments from "../Appointments";
import AddCategories from "../AddCategories";
import ShowCategories from "../ShowCategories";
import Cards from "../cards";

const { Header, Sider } = Layout;

const App = () => {
  const router = useRouter();

  const [showPharmacy, setShowPharmacy] = useState(false);
  const [showActivePharmacy, setShowActivePharmacy] = useState(false);
  const [ShowPharmacie, setShowPharmacies] = useState(false);
  const [allPharmacies, setAllPharmacies] = useState(false);
  const [requestDoctor, setRequestDoctor] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(false);
  const [categories, setCategories] = useState(false);
  const [requestPharmacie, setRequestPharmacy] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [appointments, setAppointments] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
  const [activeDoctors, setActiveDoctors] = useState(false);
  const [activePharmacy, setActivePharmacy] = useState(false);
  const [cards, setCards] = useState(false);
  const [pharmacyCount, setPharmacyCount] = useState(false);
  const [inActiveDoctors, setInActiveDoctors] = useState(false);
  const [inActivePharmacy, setInActivePharmacy] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(
    userDetails?.profileImage || null
  );
  console.log(userDetails);
  const handleShowProfileEditModal = () => {
    setShowProfileEditModal(true);
  };
  const handleForgetPassword = async (values) => {
    try {
      setLoadingUpdateProfile(true);
      const token = Cookies.get("apiToken");
      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/forget/password",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password_confirmation: values.confirmPassword,
            oldPassword: values.oldPassword,
            password: values.newPassword,
          }),
        }
      );

      if (response.ok) {
        message.success("Password reset link sent successfully");

        setShowChangePasswordModal(false);
      } else {
        message.error("Failed to send password reset link");
        console.log("Response:", response);
      }
    } catch (error) {
      console.error("Error during forget password:", error);
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/user/details",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data.user_details[0]);
          setForceRerender((prev) => !prev);
        } else {
          console.error(
            "Failed to fetch user details:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleShowPharmacies = () => {
    setShowPharmacies(true);
    setAllPharmacies(false);
    setShowCategories(false);
    setShowPharmacy(false);
    setCards(false);
    setActiveDoctor(false);
    setShowDoctor(false);
    setAppointments(false);
    setRequestPharmacy(false);
    setRequestDoctor(false);
    setAppointment(false);
    setShowDoctor(false);
    setShowActivePharmacy(false);
  };

  const handleShowPharmacy = () => {
    setShowPharmacy(true);
    setCategories(false);
    setCards(false);
    setRequestDoctor(false);
    setShowPharmacies(false);
    setShowCategories(false);
    setAllPharmacies(false);
    setShowActivePharmacy(false);
    setRequestPharmacy(false);
    setActiveDoctor(false);
    setShowDoctor(false);
  };

  const handleShowDoctorData = () => {
    setShowDoctor(true);
    setAllPharmacies(false);
    setShowCategories(false);
    setCards(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setRequestDoctor(false);
    setRequestPharmacy(false);
    setActiveDoctor(false);
    setActiveDoctor(false);
    setShowActivePharmacy(false);
    setCategories(false);
  };
  const handleShowActiveDoctor = () => {
    setActiveDoctor(true);
    setShowCategories(false);
    setShowDoctor(false);
    setCards(false);
    setCategories(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setRequestDoctor(false);
    setRequestPharmacy(false);
    setShowActivePharmacy(false);
  };
  const handleShowActivePharmacy = () => {
    setShowActivePharmacy(true);
    setActiveDoctor(false);
    setCards(false);
    setShowDoctor(false);
    setShowCategories(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setRequestDoctor(false);
    setCategories(false);
    setRequestPharmacy(false);
  };

  const handleAppointment = () => {
    setAppointment(true);
    setShowDoctor(false);
    setCards(false);
    setShowCategories(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setRequestDoctor(false);
    setRequestPharmacy(false);
    setCategories(false);
    setActiveDoctor(false);
    setAppointments(false);
  };
  const handleDocRequest = () => {
    setRequestDoctor(true);
    setShowCategories(false);
    setAppointment(false);
    setCards(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setRequestPharmacy(false);
    setActiveDoctor(false);
    setCategories(false);
    setShowActivePharmacy(false);
  };
  const handlePharmRequest = () => {
    setRequestPharmacy(true);
    setCards(false);
    setRequestDoctor(false);
    setShowCategories(false);
    setAppointment(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setCategories(false);
    setActiveDoctor(false);
    setShowActivePharmacy(false);
  };
  const handleCategories = () => {
    setCategories(true);
    setCards(false);
    setAppointments(false);
    setRequestPharmacy(false);
    setRequestDoctor(false);
    setAppointment(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setActiveDoctor(false);
    setShowCategories(false);
    setShowActivePharmacy(false);
  };
  const handleShowCategories = () => {
    setShowCategories(true);
    setAppointments(false);
    setCards(false);
    setCategories(false);
    setRequestPharmacy(false);
    setRequestDoctor(false);
    setAppointment(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setActiveDoctor(false);
    setShowActivePharmacy(false);
  };
  const handleAppointments = () => {
    setAppointments(true);
    setCards(false);
    setCategories(false);
    setRequestPharmacy(false);
    setRequestDoctor(false);
    setAppointment(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setActiveDoctor(false);
    setShowActivePharmacy(false);
  };
  const handleCards = () => {
    setCards(true);
    setAppointments(false);
    setCategories(false);
    setRequestPharmacy(false);
    setRequestDoctor(false);
    setAppointment(false);
    setShowDoctor(false);
    setAllPharmacies(false);
    setShowPharmacy(false);
    setShowPharmacies(false);
    setActiveDoctor(false);
    setShowActivePharmacy(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);

    setShowMenu(false);
  };
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
  const generateMenuItems = () => {
    if (userDetails.userRole === "1") {
      console.log("sabgqebew");
      return [
        getItem(
          "Dashboard ",
          <DashboardOutlined />,

          <>
            <a onClick={handleCards}></a>
          </>
        ),
        getItem("Request's", "sub1", <BookOutlined />, [
          getItem(
            "",
            "1",

            <>
              <button onClick={handlePharmRequest}> Pharmacy Request</button>
            </>
          ),
          getItem(
            " ",
            "2",
            <>
              <button onClick={handleDocRequest}> Doctor Request</button>
            </>
          ),
        ]),
        getItem("Doctor", "sub25", <TeamOutlined />, [
          getItem(
            "",
            "sub41",
            <>
              <button onClick={handleShowDoctorData}> Show Doctors</button>
            </>
          ),
        ]),
        getItem(" Active Doctor", "sub26", <TeamOutlined />, [
          getItem(
            "",
            "sub42",
            <>
              <button onClick={handleShowActiveDoctor}> Active Doctors</button>
            </>
          ),
        ]),
        getItem(" Pharmacy ", "sub27", <TeamOutlined />, [
          getItem(
            "",
            "sub43",
            <>
              <button onClick={handleShowPharmacy}>Show Pharmacy</button>
            </>
          ),
        ]),
        getItem("Active Pharmacy ", "sub28", <TeamOutlined />, [
          getItem(
            "",
            "sub48",
            <>
              <button onClick={handleShowActivePharmacy}>
                Active Pharmacy
              </button>
            </>
          ),
        ]),
        getItem("categories ", "sub29", <TeamOutlined />, [
          getItem(
            "",
            "sub44",
            <>
              <button onClick={handleCategories}>Add categories</button>
            </>
          ),
          getItem(
            "",
            "sub45",
            <>
              <button onClick={handleShowCategories}>Show categories</button>
            </>
          ),
        ]),
      ];
    } else if (userDetails.userRole === "3") {
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("doctordata", "sub14", <TeamOutlined />, [
          getItem(
            "",
            "sub46",
            <>
              <a onClick={handleAppointment}>Add appointment</a>
            </>
          ),
          getItem(
            "",
            "sub47",
            <>
              <a onClick={handleAppointments}>Show appointment</a>
            </>
          ),
        ]),
      ];
    } else if (userDetails.userRole === "4") {
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("pharmacy", "sub2", <TeamOutlined />, [
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

  const handleLogout = async () => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        "https://mymedjournal.blownclouds.com/api/logout",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Cookies.remove("apiToken");

        router.push("/");

        message.success(
          "Logout successful. You have been successfully logged out."
        );
      } else {
        message.error("Logout failed. Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      message.error(
        "Logout failed. An error occurred during logout. Please try again."
      );
    }
  };

  const item = generateMenuItems();

  const items = [
    {
      key: "1",
      label: (
        <a onClick={handleShowProfileEditModal}>
          <UserOutlined /> Profile edit
        </a>
      ),
    },

    {
      key: "2",
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
        <a onClick={handleLogout}>
          <LogoutOutlined />
          Logout
        </a>
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

  const handleChange = (info) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj || info.file, (url) => {
        setLoading(false);
        setImageUrl(url);
        setForceRerender((prev) => !prev);
        console.log("Image URL:", url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        className="w-[100%]"
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleProfileEdit = async (values) => {
    try {
      setLoadingUpdateProfile(true);
      const token = Cookies.get("apiToken");
      const userId = userDetails.id;
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("affiliationNo", values.affiliationNo);
      formData.append("noOfExperience", values.noOfExperience);
      formData.append("gender", values.gender);
      formData.append("specialization", values.specialization);
      formData.append("age", values.age);

      if (values.upload && values.upload.length > 0) {
        formData.append("profileImage", values.upload[0].originFileObj);
      }

      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/users/edituser/${userId}`,
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
        const data = await response.json();
        setLoadingUpdateProfile(false);

        const updatedUserDetails = {
          ...userDetails,
          userName: values.userName,
          affiliationNo: values.affiliationNo,
          profileImage: data.profileImage || userDetails.profileImage,
        };
        setUserDetails(updatedUserDetails);
        setUserProfileImage(data.profileImage || userDetails.profileImage);

        message.success("Profile updated successfully");
        setShowProfileEditModal(false);
        setForceRerender((prev) => !prev);

        handleChange({
          file: {
            status: "done",
            originFileObj: values.upload[0].originFileObj,
          },
        });
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error during profile edit:", error);
    }
  };

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
          const activeDoctors = data.doctor.filter(
            (doctor) => doctor.isActives == 1
          );
          const inActiveDoctors = data.doctor.filter(
            (doctor) => doctor.isActives == 0
          );

          console.log("Active doctors:", activeDoctors);
          setDoctorsCount(data.doctor.length);
          setActiveDoctors(activeDoctors.length);
          setInActiveDoctors(inActiveDoctors.length);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/fatch/all/Pharmacies",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Pharmacy fetched successfully:", data);
          const activePharmacy = data.all_pharmacies.filter(
            (Pharmacy) => Pharmacy.isActives == 1
          );
          const inActivePharmacy = data.all_pharmacies.filter(
            (Pharmacy) => Pharmacy.isActives == 0
          );

          console.log("Active doctors:", activeDoctors);
          setPharmacyCount(data.all_pharmacies.length);
          setActivePharmacy(activePharmacy.length);
          setInActivePharmacy(inActivePharmacy.length);
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
  const handleLogoClick = () => {
    // Toggle the state to show/hide cards
    setShowCards(!showCards);
  };
  return (
    <Layout
      className="rounded-[20px]"
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        className="!bg-[#2361dd] min-w-[800px] !rounded-[15px] mt-[5px] ml-[5px]"
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        trigger
      >
        <div className="p-[30px] text-[22px]" onClick={handleLogoClick}>
          <h1 className="text-white text-center">
            <Image
              width={1000}
              height={1000}
              alt=""
              className=""
              src="/assserts/images/logo-white.png"
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
          className="!bg-[#2361dd] !rounded-[15px] mt-[5px] ml-[5px] mr-[5px]"
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
            </div>
            <div>
              <Modal
                title="Change Password"
                open={showChangePasswordModal}
                onCancel={handleCloseChangePasswordModal}
                footer={null}
              >
                <Form
                  form={form}
                  name="changePasswordForm"
                  onFinish={handleForgetPassword}
                  onFinishFailed={onFinishFailed}
                >
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
                    <Button
                      className="bg-[#2361dd] !text-white"
                      htmlType="submit"
                      loading={loadingUpdateProfile}
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <div className="flex text-center items-center">
                <img
                  alt=""
                  className="w-[30px] h-[30px] rounded-[50%]"
                  src={imageUrl || userDetails?.profileImage || null}
                />
                <Dropdown
                  className="mr-[20px]"
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="text-[#fff] ml-[10px]">
                      {userDetails?.userName}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>

              <Modal
                title="Edit Profile"
                open={showProfileEditModal}
                onCancel={() => setShowProfileEditModal(false)}
                footer={null}
              >
                <Form
                  form={form}
                  name="editProfileForm"
                  initialValues={{
                    userName: userDetails.userName,
                    affiliationNo: userDetails.affiliationNo,
                    specialization: userDetails.specialization,
                    gender: userDetails.gender,
                    noOfExperience: userDetails.noOfExperience,
                    age: userDetails.age,
                  }}
                  onFinish={handleProfileEdit}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    className="h-[50px] mb-[80px] w-[100%]"
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                    extra=" "
                    rules={[
                      {
                        required: true,
                        message: "Please upload your doctor image!",
                      },
                    ]}
                  >
                    <Upload
                      name="upload"
                      listType="picture-card"
                      className="avatar-uploader w-[100%]"
                      showUploadList={false}
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl && typeof imageUrl === "string" ? (
                        <img
                          alt=""
                          className="w-[30px] h-[30px] rounded-[50%]"
                          src={imageUrl}
                        />
                      ) : userProfileImage ? (
                        <img
                          alt=""
                          className="w-[30px] h-[30px] rounded-[50%]"
                          src={userProfileImage}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                  <label className="mb-[10px] ml-[2px]">UserName</label>

                  <Form.Item
                    className="mt-[10px]"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter userName",
                      },
                    ]}
                  >
                    <Input placeholder="User Name" />
                  </Form.Item>
                  <label className="mb-[10px]  ml-[2px]">Gender</label>
                  <Form.Item
                    className="mt-[10px]"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Please enter gender",
                      },
                    ]}
                  >
                    <Input placeholder="gender" />
                  </Form.Item>
                  <label className="mb-[10px]  ml-[2px]">Age</label>
                  <Form.Item
                    className="mt-[10px]"
                    name="age"
                    rules={[
                      {
                        required: true,
                        message: "Please enter gender",
                      },
                    ]}
                  >
                    <Input placeholder="gender" />
                  </Form.Item>
                  {userDetails.userRole === "3" && (
                    <>
                      <label className="mb-[10px]  ml-[2px]">
                        Specialization
                      </label>
                      <Form.Item
                        className="mt-[10px]"
                        name="specialization"
                        rules={[
                          {
                            required: true,
                            message: "Please enter specialization",
                          },
                        ]}
                      >
                        <Input placeholder="specialization" />
                      </Form.Item>
                      <label className="mb-[10px]  ml-[2px]">Experience</label>

                      <Form.Item
                        className="mt-[10px]"
                        name="noOfExperience"
                        rules={[
                          {
                            required: true,
                            message: "Please enter noOfExperience",
                          },
                        ]}
                      >
                        <Input placeholder="noOfExperience" />
                      </Form.Item>
                      <label className="mb-[10px]  ml-[2px]">
                        affiliationNo
                      </label>
                      <Form.Item
                        className="mt-[10px]"
                        name="affiliationNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter affiliationNo",
                          },
                        ]}
                      >
                        <Input placeholder="affiliationNo" />
                      </Form.Item>
                    </>
                  )}
                  {userDetails.userRole === "4" && (
                    <>
                      <label className="mb-[10px]  ml-[2px]">
                        affiliationNo
                      </label>
                      <Form.Item
                        className="mt-[10px]"
                        name="affiliationNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter affiliationNo",
                          },
                        ]}
                      >
                        <Input placeholder="affiliationNo" />
                      </Form.Item>
                      <label className="mb-[10px]  ml-[2px]">Age</label>
                      <Form.Item
                        className="mt-[10px]"
                        name="age"
                        rules={[
                          {
                            required: true,
                            message: "Please enter age",
                          },
                        ]}
                      >
                        <Input placeholder="age" />
                      </Form.Item>
                    </>
                  )}

                  <Form.Item>
                    <Button
                      className="bg-[#2361dd] !text-white"
                      htmlType="submit"
                      loading={loadingUpdateProfile}
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        </Header>

        <div>
          {ShowPharmacie && <ShowPharmacies />}
          {showPharmacy && <PharmacyData />}
          {appointment && <AddAppointment />}
          {showDoctor && <DoctorData />}
          {allPharmacies && <ShowAllPharmacies />}
          {requestDoctor && <RequestDoctor />}
          {requestPharmacie && <RequestPharmacy />}
          {activeDoctor && <ActiveDoctors />}
          {showActivePharmacy && <ActivePharmacy />}
          {appointments && <Appointments />}
          {cards && <Cards />}
          {categories && <AddCategories />}
          {showCategories && <ShowCategories />}
          {!ShowPharmacie &&
            !showPharmacy &&
            !appointment &&
            !showDoctor &&
            !allPharmacies &&
            !requestDoctor &&
            !requestPharmacie &&
            !activeDoctor &&
            !showActivePharmacy &&
            !appointments &&
            !categories &&
            !showCategories &&
            !cards &&
            userDetails.userRole == 1 && <Cards />}
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
