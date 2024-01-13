import React, { useState, useEffect } from 'react';
import { Table,Input, Modal } from 'antd';
import Cookies from 'js-cookie';

import { EyeOutlined, SearchOutlined } from '@ant-design/icons';

const ShowPharmacies = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedData, setSelectedData] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // Add this line
console.log(userData)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get('apiToken');
        const response = await fetch(
          'https://mymedjournal.blownclouds.com/api/Pharmacies/plan/show',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data.filtered_pharmacies);
        } else {
          console.error(
            'Failed to fetch user details:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error during fetching user details:', error.message);
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
  const columns = [
    { title: "Medicine Name", dataIndex: "madicinName", key: "madicinName" },

    {
      title: 'User Image',
      dataIndex: 'userimage',
      key: 'userimage',
      render: (text, record) => (
        <img
          src={record.userimage}
          alt="Profile"
          style={{ maxWidth: '100px', maxHeight: '100px' }}
        />
      ),
    },
    {
      title: 'Medicine Image',
      dataIndex: 'madicinImage',
      key: 'madicinImage',
      render: (text, record) => (
        <img
          src={record.madicinImage}
          alt="Profile"
          style={{ maxWidth: '100px', maxHeight: '100px' }}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <div>
          <EyeOutlined
            className="text-[#1f9c40] ml-[10px]"
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
        <h1 className="Doctors">Doctors</h1>
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
           width={300}
        title="View Details"
        visible={isViewModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedData && (
          <div>
            <div className='w-full justify-center flex flex-col items-center'>

             <img className='flex justify-center w-[100px] h-[100px] items-center rounded-[50%]'
          src={selectedData.userimage}
          alt="Profile"
          style={{ }}
        />
            </div>
          
            <p>username: {selectedData.username}</p>
            <p>email: {selectedData.useremail}</p>
            <p>gender: {selectedData.gender}</p>
            <p>age: {selectedData.age}</p>
         
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShowPharmacies;
