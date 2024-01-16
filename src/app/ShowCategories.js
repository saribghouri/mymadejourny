import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Input, Table, Modal, Form, message, Upload, Button } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const DoctorData = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // New state for imageUrl
  const [forceRerender, setForceRerender] = useState(false);
  const filteredcategories = categories.filter((category) =>
    category.categorieName.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/doctor/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          console.log("categories fetched successfully:", data);
          if (Array.isArray(data.Doctor_Category["data"])) {
            setCategories(data.Doctor_Category["data"]);
  
            setForceRerender((prev) => !prev);
            
   
          } else {
            console.error("Doctor_Category is not an array");
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleEdit = (record) => {
    setEditingCategoryId(record.id);
    setEditCategoryName(record.categorieName);
    setEditCategoryImage(record.categorieImage);
    setIsModalVisible(true);
    setImageUrl(record.categorieImage);
  };
  const handleSave = async (categoryId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/categories/update/${categoryId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categorieName: editCategoryName,
            categorieImage: editCategoryImage,
          }),
        }
      );
  
      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  categorieName: editCategoryName,
                  categorieImage: editCategoryImage,
                }
              : category
          )
        );
        setEditingCategoryId(null);
        setIsModalVisible(false);
     
        setImageUrl("");
      } else {
        console.error("Failed to save category changes");
      }
    } catch (error) {
      console.error("Error saving category changes:", error);
    }
  };
  

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setIsModalVisible(false);
  };

  const handleDelete = async (categoryId) => {
    try {
      const token = Cookies.get("apiToken");
      const response = await fetch(
        `https://mymedjournal.blownclouds.com/api/doctor/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        message.success("category delete  successfully");
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      } else {
        console.error("Failed to delete category:", response.status);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const editIcon = <EditOutlined style={{ color: "#2361dd" }} />;
  const saveIcon = <EditOutlined style={{ color: "#2361dd" }} />;
  const cancelIcon = <EditOutlined style={{ color: "#2361dd" }} />;
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isImage && isLt2M;
  };
  const handleChange = (info) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj || info.file, (url) => {
        setLoading(false);
        setImageUrl(url);
        setEditCategoryImage(url)
        setForceRerender((prev) => !prev);
        console.log("Image URL:", url);
      });
    }
  };
  const columns = [
    { title: "Serial No", dataIndex: "serialNo", key: "serialNo" }, 

    {
      title: "categorieImage",
      dataIndex: "categorieImage",
      key: "categorieImage",
      render: (categorieImage) => (
        <img
          className="categorieImage"
          src={categorieImage}
          alt="categorieImage"
        />
      ),
    },
    {
      title: "category Name",
      dataIndex: "categorieName",
      key: "categorieName",
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const editMode = editingCategoryId === record.id;
        return (
          <>
            <DeleteOutlined className="text-[#a82e2e] text-[18px]" onClick={() => handleDelete(record.id)} />
            {editMode ? (
              <>
                <span
                  className="ml-[20px] text-[18px]"
                  onClick={() => handleSave(record.id)}
                >
                  {saveIcon}
                </span>
                <span className="ml-[20px] text-[18px]" onClick={handleCancelEdit}>
                  {cancelIcon}
                </span>
              </>
            ) : (
              <span className="ml-[20px] text-[18px]" onClick={() => handleEdit(record)}>
                {editIcon}
              </span>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between pl-[10px] pr-[10px] ml-[16px] mr-[16px] items-center mt-[20px] mb-[20px]">
        <h1 className="categories">categories</h1>
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
        dataSource={filteredcategories.map((category, index) => ({
          ...category,
          serialNo: index + 1, 
          key: category.id,
        }))}
      />

      <Modal
        title="Edit Category"
        open={isModalVisible}
        onOk={() => handleSave(editingCategoryId)}
        onCancel={handleCancelEdit}
      >
        <Form>
          <Form.Item label="Category Name">
            <Input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </Form.Item>
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
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorData;