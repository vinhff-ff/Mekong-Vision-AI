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
  mode === 'gemini'
    ? <GeminiIcon size={18} />
    : <RobotOutlined style={{ fontSize: 18 }} />

export default function Desktop() {
  const [aiMode, setAiMode] = useState<AIMode>('built-in')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [geminiKey] = useState(() => localStorage.getItem('gemini_key') ?? '')
  const [spinning, setSpinning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  const { capture, result, loading, error, ready } = useCaptureFlow(videoRef, aiMode, geminiKey)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(err => console.error('Camera error:', err))

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(t => t.stop())
      }
    }
  }, [])

  const handleCapture = async () => {
    setSpinning(true)
    await new Promise(r => setTimeout(r, 500))
    const res = await capture()
    setSpinning(false)
    navigate('/result', { state: { entry: res?.entry } }) // truyền entry hiện tại
  }

  const aiMenuItems: MenuProps['items'] = [
    {
      key: 'built-in',
      icon: <RobotOutlined style={{ fontSize: 16 }} />,
      label: 'AI mặc định',
    },
    {
      key: 'gemini',
      icon: <GeminiIcon size={16} />,
      label: 'Gemini',
    },
  ]

  return (
    <div className="desktop-page">

      {/* CAMERA */}
      <div className="desktop-camera">
        <video ref={videoRef} autoPlay playsInline muted className="desktop-video" />

        {/* SPIN OVERLAY */}
        {spinning && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
          }}>
            <Spin size="large" />
          </div>
        )}

        {result && !spinning && (
          <div className="desktop-result">
            {result.predictions.map(p => (
              <div key={p.className} className="desktop-result__row">
                <span className="desktop-result__label">{p.className}</span>
                <div className="desktop-result__bar-wrap">
                  <div
                    className="desktop-result__bar"
                    style={{ width: `${(p.probability * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="desktop-result__pct">
                  {(p.probability * 100).toFixed(1)}%
                </span>
              </div>
            ))}
            {error && <p className="desktop-result__error">{error}</p>}
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div className="desktop-bar">

        <Dropdown
          menu={{
            items: aiMenuItems,
            selectedKeys: [aiMode],
            onClick: ({ key }) => setAiMode(key as AIMode),
          }}
          trigger={['click']}
          placement="top"
        >
          <button className="desktop-icon-btn">
            <AIIcon mode={aiMode} />
          </button>
        </Dropdown>

        <button
          className="desktop-capture-btn"
          onClick={handleCapture}
          disabled={spinning || loading || (aiMode === 'built-in' && !ready)}
        >
          <CameraOutlined />
        </button>

        <button
          className="desktop-icon-btn"
          onClick={() => navigate('/admin')}
        >
          <PieChartOutlined />
        </button>

      </div>

      {/* SETTINGS */}
      <button
        className="desktop-setting-btn"
        onClick={() => setSettingsOpen(true)}
      >
        <SettingOutlined />
      </button>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>
  )
}