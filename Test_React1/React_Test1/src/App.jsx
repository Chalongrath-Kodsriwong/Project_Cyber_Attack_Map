import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// นำเข้า Navbar และ Map จากโฟลเดอร์ components
import Navbar from './components/Navbar'
import Analytic from './components/Analytic'
import Map from './components/Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>  {/* ใช้ Router เพื่อจัดการการนำทาง */}
      <div className="App">
        <Navbar />
        <Routes>
          {/* เส้นทางสำหรับหน้าแรก */}
          <Route path="/" element={<div>
            <Map />
          </div>} />

          {/* ตั้งเส้นทางที่ตรงกับ /map ไปยังหน้า Map */}
          <Route path="/Analytic" element={<Analytic />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App