"use client";

import React, { useState } from "react";
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
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Input, Dropdown, Space, Card, Modal } from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";
const { Header, Sider } = Layout;
import { useRouter } from "next/navigation";
import AddDoctor from "../AddDoctor";
import PharmacyData from "../pharmacyData";
import DoctorData from "../DoctorData";
import AddPharmacy from "../AddPharmacy";
import AddPharmacies from "../AddPharmacies";

const App = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPharmacy, setShowAddPharmacy] = useState(false);
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowDoctor(false);
  };

  const handleShowDoctorData = () => {
    setShowDoctor(true);
    setShowAddDoctor(false);
    setShowAddPharmacy(false);
    setShowPharmacy(false);
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

  const userName = localStorage.getItem("data");
  const userId = localStorage.getItem("userRole");
  console.log(userId)
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

  const getUserRole = () => {
    const userName = localStorage.getItem("data");
    const cleanedUserName = userName !== null ? userName.replace(/"/g, "") : userName;


    const userId = localStorage.getItem("userRole");
    console.log("userId",userId)

    if (cleanedUserName.includes("admin")) {
      return "1";
    } else if (cleanedUserName.includes("doctor")) {
      return "3";
    } else if (cleanedUserName.includes("pharmacy")) {
      return "4";
    } else if(userId.includes("3")) {
      return "3";
    }else if(userId.includes("4")){
return "4"
    }
  };

  const generateMenuItems = () => {
    
    const userRole = getUserRole();

    if (userRole === "1") {
      console.log("sabgqebew")
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("Pages", "sub1", <BookOutlined />, [
          getItem("Tom", "1"),
          getItem("Bill", "2"),
          getItem("Alex", "3"),
        ]),
        getItem(
          "Doctor",
          "sub2",
          <TeamOutlined />,
          [
            getItem(
              <>
                <button onClick={handleShowDoctorData} >
                  {" "}
                  Show Doctors
                </button>
              </>
            ),
            getItem(
              <>
              <button onClick={() => handleClick("doctor")}> Add Doctor</button>
              </>
            ),
        ]),
        getItem(
          "Pharmacy",
          "sub",
          <TeamOutlined />,
          [
            getItem(
              <>
                <button onClick={handleShowPharmacyData}>Show Pharmacy</button>
              </>
            ),
            getItem(
              <>
                <button onClick={() => handleClick("pharmacy")}>
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
        getItem("doctordata", "sub14",  <TeamOutlined />, [
          getItem(
            <>
          <a>vbwbewb</a>
            </>
          ),
          getItem(
            <>
             <a>dbwbwbn</a>
            </>
          ),
        ]),
      ];
    } else if (userRole === "4") {
      return [
        getItem("Dashboard ", "1", <DashboardOutlined />),
        getItem("Doctor", "sub2", <TeamOutlined />, [
          getItem(
            <>
              <button  onClick={showModal}>
                {" "}
                Add Pharmacies
              </button>
            </>
          ),
          getItem(
            <>
              <button > show Pharmacies </button>
            </>
          ),
        ]),
      ];
    } else {
      return [getItem("Dashboard ", "1", <DashboardOutlined />)];
    }
  };

  const item = generateMenuItems();

  // const item = [
  //   getItem("Dashboard ", "1", <DashboardOutlined />),

  //   getItem("Pages", "sub1", <BookOutlined />, [
  //     getItem("Tom", "1"),
  //     getItem("Bill", "2"),
  //     getItem("Alex", "3"),
  //   ]),
  //   getItem("Doctor", "sub2", <TeamOutlined />, [
  //     getItem(
  //       <>
  //         <button onClick={() => handleClick("pharmacy")}> Add Pharmacy</button>
  //       </>
  //     ),
  //     getItem(
  //       <>
  //         <button onClick={() => handleClick("doctor")}> Add Doctor</button>
  //       </>
  //     ),
  //   ]),
  //   getItem("Layout", "20", <LayoutOutlined />),
  //   getItem("Components"),

  //   getItem("Basic UI", "sub3", <ContainerOutlined />, [
  //     getItem("Tom", "5"),
  //     getItem("Bill", "6"),
  //     getItem("Alex", "7"),
  //   ]),

  //   getItem("Extended UI", "sub4", <DeploymentUnitOutlined />, [
  //     getItem("Tom", "8"),
  //     getItem("Bill", "9"),
  //     getItem("Alex", "10"),
  //   ]),
  //   getItem("Icons", "sub5", <InfoOutlined />, [
  //     getItem("Tom", "11"),
  //     getItem("Bill", "12"),
  //     getItem("Alex", "13"),
  //   ]),
  //   getItem("Chart ", "sub6", <PieChartOutlined />, [
  //     getItem("Tom", "14"),
  //     getItem("Bill", "15"),
  //     getItem("Alex", "16"),
  //   ]),
  // ];

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
          <CustomerServiceOutlined /> Support
        </Link>
      ),
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

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >


      <Modal  footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <AddPharmacies/>
      </Modal>




      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="p-[30px] text-[22px] font-bold">
          <h1 className="text-white text-center">
            {cleanedUserName[3]}
            {cleanedUserName[4]}
            {cleanedUserName[5]}
            {cleanedUserName[6]}
            {cleanedUserName[7]}
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
              <Input
                className="w-[300px] rounded-[40px]"
                placeholder="Input search text"
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
            </div>
            <div>
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
            <div className="flex justify-between p-[30px]">
              <div>
                <h1 className="text-[#918f8f] text-[18px] font-bold">
                  Welcome!
                </h1>
              </div>
              <div className="flex gap-4">
                <h1 className="">Velonic</h1>
                <h1 className="">Dashboard</h1>
                <h1 className="">Welcome!</h1>
              </div>
            </div>
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
          {/* {showPharmacy && <PharmacyData />} */}
          {/* {showDoctor && <DoctorData />} */}
        </div>
        <div>
            {showPharmacy && <PharmacyData />}
          {showDoctor && <DoctorData />}
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
