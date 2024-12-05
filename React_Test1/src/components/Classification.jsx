import React, { useEffect, useState } from 'react';
import './css/Classification.css';
import $ from 'jquery'; 
import { setupClassificationAnimation } from './JS/classification_Fun'; 

function Classification() {
  const [attackCounts, setAttackCounts] = useState({
    "IPDB Block ip": 0,
    "HTTP DoS Attack": 0,
    "SSH Brute Force Attack": 0,
    "Unknown": 0, // เพิ่ม Unknown เพื่อรองรับประเภทที่ไม่รู้จัก
  });

  useEffect(() => {
    const fetchAttackers = () => {
      fetch('/assets/attackers.json') // เปลี่ยนเส้นทางให้ถูกต้อง
        .then((response) => response.json())
        .then((data) => {
          // กำหนดประเภทเริ่มต้นของการโจมตี
          const initialCounts = {
            "IPDB Block ip": 0,
            "HTTP DoS Attack": 0,
            "SSH Brute Force Attack": 0,
            "Unknown": 0, // สำหรับประเภทที่ไม่รู้จัก
          };

          // คำนวณจำนวนการโจมตีตามประเภท
          const counts = data.reduce((acc, attacker) => {
            const description = attacker.description || "Unknown"; // ใช้ description หรือ "Unknown" ถ้าไม่มี
            if (acc[description] !== undefined) {
              acc[description] += 1;
            } else {
              acc.Unknown += 1; // ถ้าไม่พบประเภทนี้เพิ่มเข้าไปที่ "Unknown"
            }
            return acc;
          }, initialCounts);

          setAttackCounts(counts); // อัพเดทสถานะ count
        })
        .catch((error) => console.error('Error fetching attackers data:', error));
    };

    fetchAttackers(); // เรียก fetch ครั้งแรก

    const intervalId = setInterval(fetchAttackers, 1000); // เรียก fetch ทุก ๆ 1 วินาที

    return () => clearInterval(intervalId); // ทำการเคลียร์ interval เมื่อ component ถูก unmount
  }, []); // ดำเนินการเมื่อ component โหลดเสร็จ

  // เรียกฟังก์ชัน Animation
  useEffect(() => {
    setupClassificationAnimation();
  }, []);

  return (
    <div>
      <div className="border">
        <p className="Classification">Classification</p>
        <div className="container-item">
          <p>HTTP DoS Attack: {attackCounts["HTTP DoS Attack"]}</p>
          <p>IPDB Block ip: {attackCounts["IPDB Block ip"]}</p>
          <p>SSH Brute Force Attack: {attackCounts["SSH Brute Force Attack"]}</p>
          <p>Unknown: {attackCounts.Unknown}</p>
        </div>
      </div>
    </div>
  );
}

export default Classification;
