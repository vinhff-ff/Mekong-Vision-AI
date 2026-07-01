import { MobileOutlined, DesktopOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'

type View = 'mobile' | 'desktop'

const navItems = [
    { key: 'desktop' as View, icon: <DesktopOutlined />, label: 'Desktop', path: '/desktop' },
    { key: 'mobile' as View, icon: <MobileOutlined />, label: 'Mobile', path: '/mobile' },
]

export default function Layout() {
    const [view, setView] = useState<View>('desktop')
    const navigate = useNavigate()

    return (
        <div className="layout-wrapper">

            <aside className="layout-sidebar">
                <div className="layout-sidebar__logo">
                    <img src={Logo} alt="logo" />
                </div>

                <nav className="layout-sidebar__nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            className={`layout-nav-item ${view === item.key ? 'active' : ''}`}
                            onClick={() => {
                                setView(item.key)
                                navigate(item.path)
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Token badge ở cuối sidebar */}
                <div className="layout-sidebar__token">
                 
                    <span className="layout-sidebar__token-value">128</span>
                    <span className="layout-sidebar__token-label">credits</span>
                </div>
            </aside>

            <div className="layout-right-col">
                <header className="layout-header">

                    {/* Bên trái: tiêu đề trang */}
                    <div className="layout-header__left">
                        <span className="layout-header__page-title" style={{ fontSize: 18, fontWeight: 600 , fontFamily: 'sans-serif', color: '#16A34A'}}>
                            {view === 'desktop' ? 'Mekong Vision AI' : 'Mekong Vision AI'}
                        </span>
                    </div>

                    {/* Bên phải: actions + user */}
                    <div className="layout-header__right">
                        <button className="layout-header__icon-btn">
                            <QuestionCircleOutlined />
                        </button>

                        <div className="layout-header__divider" />

                        <div className="layout-header__user">
                            <div className="layout-header__avatar">
                                <span>GP</span>
                            </div>
                            <div className="layout-header__user-info">
                                <span className="layout-header__username">Green Pulse</span>
                                <span className="layout-header__user-role">Recycling Demo</span>
                            </div>
                        </div>
                    </div>

                </header>

                <main className="layout-main">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}