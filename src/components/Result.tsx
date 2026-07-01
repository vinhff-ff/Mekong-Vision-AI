import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { LedgerEntry } from '../home/hook/useGreenLedger'

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
  'Cảm ơn bạn đã góp phần bảo vệ nguồn nước Mekong! 💧',
  'Hành động nhỏ của bạn tạo ra sự thay đổi lớn cho hành tinh! 🌍',
  'Bạn vừa giúp giảm gánh nặng carbon cho thế hệ tương lai! 🌱',
  'Mỗi chiếc áo tái chế là một bước tiến xanh! ♻️',
  'Cảm ơn bạn đã chọn tái chế thay vì vứt bỏ! 🙏',
  'Bạn đang viết nên câu chuyện xanh cho đồng bằng Mekong! 🌿',
  'Hành tinh biết ơn bạn vì quyết định hôm nay! 🌏',
  'Cùng nhau, chúng ta có thể hồi sinh dòng chảy xanh! 💚',
  'Bạn không chỉ tái chế vải — bạn đang tái chế tương lai! ✨',
  'Mỗi gram vải tái chế là một giọt nước được giữ lại cho sông Mekong! 🏞️',
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: '#888' }}>Không có dữ liệu</p>
        <Button onClick={() => navigate('/')}>Quay về</Button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
      background: '#fff',
    }}>

      {/* NÚT QUAY LẠI */}
      <div style={{ alignSelf: 'flex-start' }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>

      {/* GRADE */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Phân loại</div>
        <div style={{
          width: 100, height: 100,
          borderRadius: '50%',
          border: `4px solid ${gradeColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto',
        }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: gradeColor, lineHeight: 1 }}>
            {grade}
          </span>
        </div>
      </div>

      {/* CREDITS */}
      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#888' }}>Green Credits nhận được</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: '#16A34A', lineHeight: 1.1 }}>
          +{entry.credits}
        </div>
        <div style={{ fontSize: 16, color: '#16A34A' }}>Green Credits</div>
      </div>

      {/* CO2 + NƯỚC */}
      <div style={{
        marginTop: 40,
        display: 'flex',
        gap: 32,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#1d4ed8' }}>
            {entry.vwSaved.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Lít nước tiết kiệm</div>
        </div>

        <div style={{ width: 1, background: '#e5e7eb', alignSelf: 'stretch' }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#b45309' }}>
            {entry.co2Avoided.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>kg CO₂ tránh được</div>
        </div>
      </div>

      {/* CẢM ƠN */}
      <div style={{
        marginTop: 48,
        maxWidth: 360,
        textAlign: 'center',
        fontSize: 15,
        color: '#555',
        lineHeight: 1.7,
      }}>
        {thankMsg}
      </div>

      {/* NÚT OK */}
      <Button
        type="primary"
        size="large"
        style={{
          marginTop: 40,
          marginBottom: 40,
          background: '#16A34A',
          borderColor: '#16A34A',
          minWidth: 160,
          height: 48,
          fontSize: 16,
        }}
        onClick={() => navigate('/')}
      >
        OK
      </Button>

    </div>
  )
}