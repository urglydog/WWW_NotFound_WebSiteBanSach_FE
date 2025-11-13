"use client"

import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Card } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { useState } from "react"

const mockPromotions = [
  { id: 1, name: "Giảm 10% sách văn học", code: "VANHOCDISCOUNT10", discount: 10, active: true },
  { id: 2, name: "Giảm 20% đơn trên 500k", code: "SALE20LARGE", discount: 20, active: true },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleSubmit = (values: any) => {
    if (editingId) {
      setPromotions(promotions.map((p) => (p.id === editingId ? { ...p, ...values } : p)))
      message.success("Cập nhật thành công")
    } else {
      setPromotions([...promotions, { id: Math.max(...promotions.map((p) => p.id), 0) + 1, ...values, active: true }])
      message.success("Thêm khuyến mãi thành công")
    }
    setIsModalVisible(false)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xóa khuyến mãi",
      content: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setPromotions(promotions.filter((p) => p.id !== id))
        message.success("Xóa thành công")
      },
    })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-6 px-4 py-6 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Quản lý khuyến mãi</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm khuyến mãi
          </Button>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <Table
            dataSource={promotions}
            columns={[
              { title: "ID", dataIndex: "id" },
              { title: "Tên", dataIndex: "name" },
              { title: "Mã", dataIndex: "code" },
              { title: "Giảm (%)", dataIndex: "discount" },
              {
                title: "Hành động",
                render: (_, record) => (
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(record.id)
                        form.setFieldsValue(record)
                        setIsModalVisible(true)
                      }}
                    >
                      Sửa
                    </Button>
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>

        <Modal
          title={editingId ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          open={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="discount" label="Giảm giá (%)" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
