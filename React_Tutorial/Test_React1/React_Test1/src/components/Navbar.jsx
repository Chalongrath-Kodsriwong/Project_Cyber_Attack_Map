import React from 'react'
import { Link } from 'react-router-dom'
import './css/Navbar.css'

function Navbar() {
  return (
    <>
    <div style={{display: "flex", justifyContent: "space-between", padding: "10px 20px", backgroundColor: "#191919", alignItems: "center"}}>
    <h1 style={{fontSize: "20px"}}>Ruk-Com <p>Cloud</p></h1>
    <h3 style={{display: "flex", alignItems: "center"}}>Cyber Attacker Map</h3>
    <div className="menu">
      {/* มันคือ tag a */}
        <Link to="/">Home</Link>
        <Link to="/Analytic">Analytic</Link> 
        <a href="https://ruk-com.cloud/">Ruk-Com Site</a>
    </div>
    </div>
    </>
  )
}

export default Navbar
