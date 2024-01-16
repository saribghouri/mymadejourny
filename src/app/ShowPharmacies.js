import React, { useState, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import Cookies from "js-cookie";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

const ShowPharmacies = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [medicineImageVisible, setMedicineImageVisible] = useState(false);
  const [medicineImage, setMedicineImage] = useState("");
  console.log(userData);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/Pharmacies/plan/show",
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
          setUserData(data.filtered_pharmacies);
        } else {
          console.error(
            "Failed to fetch user details:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetching user details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);
  const handleView = (record) => {
    setSelectedData(record);

    setIsViewModalVisible(true);
  };

  const handleModalClose = () => {
    setIsViewModalVisible(false);
  };
  const handleViewMedicineImage = (record) => {
    setMedicineImage(record.madicinImage);
    setMedicineImageVisible(true);
  };

  const columns = [
    {
      title: "User Image",
      dataIndex: "userimage",
      key: "userimage",
      render: (text, record) => (
        <img
          className="rounded-[100%] h-[80px] w-[80px]"
          src={record.userimage}
          alt="Profile"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      ),
    },
    { title: "User Name", dataIndex: "username", key: "username" },
    { title: "Medicine Name", dataIndex: "madicinName", key: "madicinName" },

    {
      title: "Medicine Image",
      dataIndex: "madicinImage",
      key: "madicinImage",
      render: (text, record) => (
        <img
          className="cursor-pointer object-cover"
          src={record.madicinImage}
          alt="Profile"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
          onClick={() => handleViewMedicineImage(record)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <div>
          <EyeOutlined
            className="text-[#1f9c40] ml-[10px] text-[18px]"
            type="link"
            onClick={() => handleView(record)}
          />
        </div>
      ),
    },
  ];

  const filteredDoctor = userData
    ? userData.filter((doctor) =>
        doctor.madicinName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[10px] mb-[20px]">
        <h1 className="Doctors">Users Requests</h1>
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
        dataSource={filteredDoctor.map((category, index) => ({
          ...category,
          serialNo: index + 1,
          key: category.id,
        }))}
      />
      <Modal
        className="text-center mb-[20px]"
        width={300}
        title="View Details"
        open={isViewModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedData && (
          <div>
            <div className="w-full justify-center flex flex-col items-center">
              <img
                className="flex justify-center  w-[100px] h-[100px] object-cover items-center rounded-[50%]"
                src={selectedData.userimage}
                alt="Profile"
              />
            </div>
            <div className="flex flex-col gap-[20px] mt-[20px]">
              <p className="flex justify-between items-center">
                <span className="font-bold mr-[110px]">Name:</span>
                <p>{selectedData.username}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[50px]">Email:</span>
                <p>{selectedData.useremail}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[80px]">Experience:</span>
                <p>{selectedData.gender}</p>
              </p>

              <p className="flex justify-between items-center">
                <span className="font-bold mr-[60px]">Specialization:</span>
                <p>{selectedData.age}</p>
              </p>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        className="modal-bhai"
        visible={medicineImageVisible}
        onCancel={() => setMedicineImageVisible(false)}
        footer={null}
        closeIcon={null}
      >
        {medicineImage && (
          <img
            className=" flex object-cover"
            src={medicineImage}
            alt="Medicine"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "0px",
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ShowPharmacies;
