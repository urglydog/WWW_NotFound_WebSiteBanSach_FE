"use client"

import { UserLayout } from "@/components/layout/user-layout"
import { Form, Input, Button, Card, message, Checkbox } from "antd"
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = false

  const handleRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu không trùng khớp")
      return
    }

    setLoading(true)
    try {
      const newUser = {
        id: Math.floor(Math.random() * 10000),
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone || "",
        address: "",
        role: "CUSTOMER",
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        }),
      )

      message.success("Đăng ký thành công")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserLayout>
      <div className="max-w-md mx-auto py-12">
        <Card>
          <h1 className="text-2xl font-bold text-center mb-8">Đăng ký tài khoản</h1>

          <Form onFinish={handleRegister} layout="vertical">
            <Form.Item name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
                { min: 4, message: "Tên đăng nhập ít nhất 4 ký tự" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item name="phone" rules={[{ pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại (tùy chọn)" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item name="confirmPassword" rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error("Bạn phải đồng ý với điều khoản")),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Điều khoản dịch vụ
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>
        </Card>
      </div>
    </UserLayout>
  )
}
