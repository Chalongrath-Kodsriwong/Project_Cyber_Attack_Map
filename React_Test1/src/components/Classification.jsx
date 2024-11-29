import React, { useEffect, useState } from 'react';
import "./css/Classification.css"

function Classification() {
  const [attackCounts, setAttackCounts] = useState({
    DDoS: 0,
    "SQL Injection": 0,
    Phishing: 0,
    Malware: 0,
    Ransomware: 0,
    Unknown: 0, // เริ่มต้น Unknown ที่ 0
  });

  useEffect(() => {
    const fetchAttackers = () => {
      fetch('/src/assets/attackers.json') // ระบุ path ให้ถูกต้อง
        .then((response) => response.json())
        .then((data) => {
          // สร้างตัวนับประเภทการโจมตี
          const initialCounts = {
            DDoS: 0,
            "SQL Injection": 0,
            Phishing: 0,
            Malware: 0,
            Ransomware: 0,
            Unknown: 0, // กำหนดค่าเริ่มต้นของทุกประเภท
          };

          const counts = data.reduce((acc, attacker) => {
            const type = attacker.type || "Unknown"; // ใช้ "Unknown" ถ้าไม่มีประเภท
            if (acc[type] !== undefined) {
              acc[type] += 1; // ถ้าเป็นประเภทที่กำหนดไว้ล่วงหน้า ให้เพิ่ม count
            } else {
              acc.Unknown += 1; // ถ้าไม่รู้จัก ให้เพิ่มไปที่ Unknown
            }
            return acc;
          }, initialCounts);

          setAttackCounts(counts); // อัปเดต State
        })
        .catch((error) => console.error('Error fetching attackers data:', error));
    };

    fetchAttackers(); // ดึงข้อมูลครั้งแรกเมื่อ component mount

    const intervalId = setInterval(fetchAttackers, 1000); // ดึงข้อมูลใหม่ทุก 1 วินาที

    return () => clearInterval(intervalId); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div>
      <p className='Classification'>Classification</p>
      <div className='container-item'>
        {/* แสดงผลประเภทการโจมตีพร้อมจำนวน */}
        <p>DDoS: {attackCounts.DDoS}</p>
        <p>SQL Injection: {attackCounts["SQL Injection"]}</p>
        <p>Phishing: {attackCounts.Phishing}</p>
        <p>Malware: {attackCounts.Malware}</p>
        <p>Ransomware: {attackCounts.Ransomware}</p>
        <p>Unknown: {attackCounts.Unknown}</p>
      </div>
    </div>
  );
}

export default Classification;
