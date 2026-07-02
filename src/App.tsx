import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layout/layout-main'
import Desktop from './home/desktop/desktop'
import Mobile from './home/mobile/mobile'
import './style/index.scss'
import Result from './components/Result'
import Admin from './home/Admin'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/desktop" replace />} />
          <Route path="/desktop" element={<Desktop />} />
          <Route path="/mobile" element={<Mobile />} />
        </Route>
        <Route >
          <Route path="/result" element={<Result />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}