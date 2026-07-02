import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Empty, Image, Table, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGreenLedger } from '../home/hook/useGreenLedger'
import type { LedgerEntry } from '../home/hook/useGreenLedger'
const GRADE_MAP: Record<string, string> = {
  'Class 1': 'A',
  'Class 2': 'B',
  'Class 3': 'C',
}

const GRADE_LABEL: Record<string, string> = {
  'Class 1': 'New item',
  'Class 2': 'Used item',
  'Class 3': 'Recycled item',
}

const GRADE_COLOR: Record<string, string> = {
  'Class 3': '#dc2626',
  'Class 2': '#d97706',
  'Class 1': '#16A34A',
}

export default function Admin() {
  const navigate = useNavigate()
  const { getTotals, clearLedger } = useGreenLedger()
  const [totals, setTotals] = useState(() => getTotals())

  const refresh = () => setTotals(getTotals())

  const handleClear = () => {
    clearLedger()
    refresh()
  }

  const countByClass = (cls: string) =>
    totals.entries.filter(e => e.className === cls).length

  const columns: ColumnsType<LedgerEntry> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 90,
      render: (src: string) => (
        <Image
          src={src}
          alt="captured"
          width={56}
          height={56}
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'className',
      key: 'className',
      render: (cls: string) => (
        <Tag color={GRADE_COLOR[cls] ?? '#888'}>
          {GRADE_MAP[cls] ?? '?'} · {GRADE_LABEL[cls] ?? cls}
        </Tag>
      ),
      filters: Object.keys(GRADE_MAP).map(cls => ({ text: GRADE_LABEL[cls], value: cls })),
      onFilter: (value, record) => record.className === value,
    },
    {
      title: 'Mass (kg)',
      dataIndex: 'massKg',
      key: 'massKg',
      render: (v: number) => v.toFixed(1),
      sorter: (a, b) => a.massKg - b.massKg,
    },
    {
      title: 'Water saved (L)',
      dataIndex: 'vwSaved',
      key: 'vwSaved',
      render: (v: number) => v.toLocaleString('en-US'),
      sorter: (a, b) => a.vwSaved - b.vwSaved,
    },
    {
      title: 'CO₂ avoided (kg)',
      dataIndex: 'co2Avoided',
      key: 'co2Avoided',
      render: (v: number) => v.toFixed(2),
      sorter: (a, b) => a.co2Avoided - b.co2Avoided,
    },
    {
      title: 'Credit',
      dataIndex: 'credits',
      key: 'credits',
      render: (v: number) => `+${v}`,
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (t: number) => new Date(t).toLocaleString('en-US'),
      sorter: (a, b) => a.timestamp - b.timestamp,
      defaultSortOrder: 'descend',
    },
  ]

  return (
    <div className="admin-page">

      <div className="admin-page__header">
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Popconfirm
          title="Delete all data?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          onConfirm={handleClear}
        >
          <Button icon={<DeleteOutlined />} danger type="text">
            Delete data
          </Button>
        </Popconfirm>
      </div>

      <div className="admin-page__body">

        {/* CỘT TRÁI: STATS */}
        <div className="admin-page__stats">

          <div className="admin-page__credit-card">
            <span className="admin-page__credit-label">Tổng Green Credit</span>
            <span className="admin-page__credit-value">{totals.totalCredits}</span>
          </div>

          <div className="admin-page__type-cards">
            {(['Class 1', 'Class 2', 'Class 3'] as const).map(cls => (
              <div key={cls} className="admin-page__type-card">
                <span
                  className="admin-page__type-badge"
                  style={{ background: GRADE_COLOR[cls] }}
                >
                  {GRADE_MAP[cls]}
                </span>
                <span className="admin-page__type-value">{countByClass(cls)}</span>
                <span className="admin-page__type-label">{GRADE_LABEL[cls]}</span>
              </div>
            ))}
          </div>

          <div className="admin-page__eco-cards">
            <div className="admin-page__eco-card">
              <span className="admin-page__eco-value">
                {totals.totalVwSaved.toLocaleString('vi-VN')}
              </span>
              <span className="admin-page__eco-label">Liters of water saved</span>
            </div>
            <div className="admin-page__eco-card">
              <span className="admin-page__eco-value">
                {totals.totalCo2Avoided.toFixed(2)}
              </span>
              <span className="admin-page__eco-label">kg CO₂ avoided</span>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: BẢNG DỮ LIỆU */}
        <div className="admin-page__table-wrap">
          {totals.entries.length === 0 ? (
            <Empty description="No data yet" style={{ marginTop: 80 }} />
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={totals.entries}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 700 }}
            />
          )}
        </div>

      </div>
    </div>
  )
}