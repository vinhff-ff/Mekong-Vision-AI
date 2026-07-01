import {
  CameraOutlined,
  RobotOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Dropdown, Spin } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import để điều hướng
import type { AIMode } from '../../types/ai'
import GeminiIcon from '../../components/GeminiIcon'
import SettingsModal from '../../components/SettingsModal'
import { useCaptureFlow } from '../hook/useCaptureFlow' // Import hook logic

const AIIcon = ({ mode }: { mode: AIMode }) =>
  mode === 'gemini' ? <GeminiIcon size={18} /> : <RobotOutlined />

export default function Mobile() {
  const [aiMode, setAiMode] = useState<AIMode>('built-in')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [geminiKey] = useState(() => localStorage.getItem('gemini_key') ?? '')
  const [spinning, setSpinning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  // Hook xử lý luồng chụp ảnh
  const { capture, result, loading, ready } = useCaptureFlow(videoRef, aiMode, geminiKey)

  useEffect(() => {
    // Ưu tiên camera sau trên thiết bị di động
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(err => console.error('Camera error:', err))

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const handleCapture = async () => {
    setSpinning(true)
    const res = await capture()
    setSpinning(false)
    if (res?.entry) {
      navigate('/result', { state: { entry: res.entry } })
    }
  }

  const aiMenuItems: MenuProps['items'] = [
    { key: 'built-in', icon: <RobotOutlined />, label: 'AI mặc định' },
    { key: 'gemini', icon: <GeminiIcon size={16} />, label: 'Gemini' },
  ]

  return (
    <div className="mobile-page">
      <button className="mobile-setting-btn" onClick={() => setSettingsOpen(true)}>
        <SettingOutlined />
      </button>

      <div className="mobile-camera">
        <video ref={videoRef} autoPlay playsInline muted className="mobile-video" />

        {/* Overlay khi đang xử lý */}
        {spinning && (
          <div className="mobile-spin-overlay">
            <Spin size="large" />
          </div>
        )}

        {/* Kết quả hiển thị trên mobile (giống desktop) */}
        {result && !spinning && (
          <div className="mobile-result">
            {result.predictions.map(p => (
              <div key={p.className} className="mobile-result__row">
                <span>{p.className}: {(p.probability * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mobile-bar">
        <Dropdown
          menu={{
            items: aiMenuItems,
            selectedKeys: [aiMode],
            onClick: ({ key }) => setAiMode(key as AIMode),
          }}
          trigger={['click']}
          placement="top"
        >
          <button className="mobile-bar__icon-btn">
            <AIIcon mode={aiMode} />
          </button>
        </Dropdown>

        {/* Nút chụp đã gắn hàm handleCapture */}
        <button 
          className="mobile-bar__capture" 
          onClick={handleCapture}
          disabled={spinning || loading || (aiMode === 'built-in' && !ready)}
        >
          <CameraOutlined />
        </button>

        <button className="mobile-bar__icon-btn" onClick={() => navigate('/admin')}>
          <PieChartOutlined />
        </button>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}