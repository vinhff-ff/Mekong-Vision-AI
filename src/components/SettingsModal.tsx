import { Modal, Input, Form } from 'antd'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then(values => {
      // TODO: pass geminiKey lên hook/context
      console.log('Gemini API Key saved:', values.geminiKey)
      onClose()
    })
  }

  return (
    <Modal
      title="Cài đặt"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="geminiKey"
          label="Gemini API Key"
          rules={[{ required: true, message: 'Nhập API key' }]}
        >
          <Input.Password placeholder="AIza..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}