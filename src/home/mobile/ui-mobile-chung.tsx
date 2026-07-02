import {
  CameraOutlined,
  RobotOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Dropdown, Spin } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AIMode } from '../../types/ai'
import GeminiIcon from '../../components/GeminiIcon'
import SettingsModal from '../../components/SettingsModal'
import { useCaptureFlow } from '../hook/useCaptureFlow'

const AIIcon = ({ mode }: { mode: AIMode }) =>
  mode === 'gemini' ? <GeminiIcon size={18} /> : <RobotOutlined />

export default function Mobile() {
  const [aiMode, setAiMode] = useState<AIMode>('built-in')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [geminiKey] = useState(() => localStorage.getItem('gemini_key') ?? '')
  const [spinning, setSpinning] = useState(false)
  const [frozenFrame, setFrozenFrame] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  const { capture, result, loading, ready } = useCaptureFlow(videoRef, aiMode, geminiKey)

  useEffect(() => {
    // Mobile: dùng cam trước (user) -> cần mirror giống desktop
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
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

  const snapFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // cam trước bị mirror trên UI -> flip lại khi vẽ để khớp với cái mắt nhìn thấy
    ctx.save()
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.restore()

    setFrozenFrame(canvas.toDataURL('image/jpeg', 0.9))
  }

  const handleCapture = async () => {
    snapFrame()
    setSpinning(true)
    const res = await capture()
    setSpinning(false)
    if (res?.entry) {
      navigate('/result', { state: { entry: res.entry } })
    }
  }

  const aiMenuItems: MenuProps['items'] = [
    { key: 'built-in', icon: <RobotOutlined />, label: 'Default AI' },
    // { key: 'gemini', icon: <GeminiIcon size={16} />, label: 'Gemini' },
  ]

  return (
    <div className="mobile-page">
      {/* <button className="mobile-setting-btn" onClick={() => setSettingsOpen(true)}>
        <SettingOutlined />
      </button> */}

      <div className="mobile-camera">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="mobile-video"
          style={{ transform: 'scaleX(-1)' }}
        />

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {frozenFrame && spinning && (
          <img
            src={frozenFrame}
            alt="captured frame"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {spinning && (
          <div className="mobile-spin-overlay">
            <Spin size="large" />
          </div>
        )}

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