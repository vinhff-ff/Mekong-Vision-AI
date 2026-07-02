import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { LedgerEntry } from '../home/hook/useGreenLedger'

import bgImage from '../assets/bg.jpg';

const GRADE_MAP: Record<string, string> = {
  'Class 1': 'A',
  'Class 2': 'B',
  'Class 3': 'C',
}

const GRADE_COLOR: Record<string, string> = {
  A: '#16A34A',
  B: '#d97706',
  C: '#dc2626',
}

const THANK_YOU = [
  'Thank you for helping protect the Mekong water source! 💧',
  'Your small action makes a big difference for the planet! 🌍',
  'You just reduced the carbon burden for future generations! 🌱',
  'Every recycled garment is a green step forward! ♻️',
  'Thank you for choosing recycling over disposal! 🙏',
  'You are writing a greener story for the Mekong Delta! 🌿',
  'The planet is grateful for your choice today! 🌏',
  'Together, we can revive the green flow! 💚',
  'You are not just recycling fabric — you are recycling the future! ✨',
  'Each gram of recycled fabric is a drop of water saved for the Mekong! 🏞️',
]
export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const entry = location.state?.entry as LedgerEntry | undefined

  const thankMsg = useMemo(
    () => THANK_YOU[Math.floor(Math.random() * THANK_YOU.length)],
    [],
  )

  const grade = entry ? (GRADE_MAP[entry.className] ?? '?') : '?'
  const gradeColor = GRADE_COLOR[grade] ?? '#888'

  if (!entry) {
    return (
      <div className="result-empty">
        <p>No data</p>
        <Button onClick={() => navigate('/')}>Back</Button>
      </div>
    )
  }

  return (
    <div
      className="result-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="result-overlay" />

      <Button
        className="result-back"
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>

      <div className="result-card">

        <div className="result-grade">
          <div className="label">Classification</div>

          <div
            className="grade-circle"
            style={{ borderColor: gradeColor }}
          >
            <span style={{ color: gradeColor }}>
              {grade}
            </span>
          </div>
        </div>

        <div className="credits">
          <div className="label">
            Green Credits earned
          </div>

          <div className="credit-value">
            +{entry.credits}
          </div>

          <div className="credit-text">
            Green Credits
          </div>
        </div>

        <div className="stats">

          <div className="item">
            <div className="number water">
              {entry.vwSaved.toLocaleString('vi-VN')}
            </div>
            <div className="desc">
              Liters of water saved
            </div>
          </div>

          <div className="divider" />

          <div className="item">
            <div className="number co2">
              {entry.co2Avoided.toFixed(2)}
            </div>
            <div className="desc">
              kg CO₂ avoided
            </div>
          </div>

        </div>

        <div className="thank">
          {thankMsg}
        </div>

        <Button
          type="primary"
          size="large"
          className="ok-btn"
          onClick={() => navigate('/')}
        >
          OK
        </Button>

      </div>
    </div>
  )
}