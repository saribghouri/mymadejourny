import { Divider, Table } from 'antd'
import React from 'react'

const PharmacyData = () => {
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Age',
          dataIndex: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
        },
      ];
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
        },
      ];
  return (
    <div>
        {/* <h1>vebb</h1> */}
     
    <Table columns={columns} dataSource={data} size="middle" />
    </div>
  )
}

export default PharmacyData
