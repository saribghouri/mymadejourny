"use client"
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation'
import Link from 'antd/es/typography/Link';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Login= ()=> {
  const router = useRouter()
  
  const onFinish = (values) => {
 
    router.push("/dashboard");
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <main className="bg-[#f1eeee] flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#ffffff]  gap-[40px] rounded-[20px] h-[500px] text-center flex flex-col w-[400px]">
   
   <div className='bg-[#1b70a8] w-[400px] rounded-t-[20px] h-[400px] flex items-center justify-center'>

   <h1 className='text-[30px] font-bold text-white'>Doctor </h1>
   </div>
 
   <div className=' p-6 gap-[40px] rounded-[20px] h-[500px] text-center flex flex-col w-[300px] mx-auto'>
   
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
                  message: 'Please enter your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input className='h-[40px] border' prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password type="umber" className='h-[40px] border' prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button   htmlType="submit" className='bg-[#1b70a8] w-[250px] h-[40px] !text-white text-[18px] text-center'>
                Login
              </Button>
            </Form.Item>
          </Form>
  <Link>forgot passowrd?</Link>
   </div>
      </div>

     

     
    </main>
  )
}

export default Login