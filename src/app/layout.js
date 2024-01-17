
"use client"
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const fetchData = async () => {
    
      setTimeout(() => {
        setLoading(false); 
      }, 3000);
    };

    fetchData();
  }, []); 

  return (
    <html lang="en">
      <body>
        {loading ? (
          <Spin
          className="flex justify-center w-[100%] h-[500px] items-center"
          indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />}
        />
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
