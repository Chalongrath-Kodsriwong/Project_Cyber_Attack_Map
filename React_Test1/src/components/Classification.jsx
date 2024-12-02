import React, { useEffect, useState } from 'react';
import './css/Classification.css';
import $ from 'jquery'; // ต้องติดตั้ง jQuery ผ่าน npm หรือ Yarn


function Classification() {
  const [attackCounts, setAttackCounts] = useState({
    DDoS: 0,
    "SQL Injection": 0,
    Phishing: 0,
    Malware: 0,
    Ransomware: 0,
    Unknown: 0,
  });

  useEffect(() => {
    const fetchAttackers = () => {
      fetch('/src/assets/attackers.json')
        .then((response) => response.json())
        .then((data) => {
          const initialCounts = {
            DDoS: 0,
            "SQL Injection": 0,
            Phishing: 0,
            Malware: 0,
            Ransomware: 0,
            Unknown: 0,
          };

          const counts = data.reduce((acc, attacker) => {
            const type = attacker.type || "Unknown";
            if (acc[type] !== undefined) {
              acc[type] += 1;
            } else {
              acc.Unknown += 1;
            }
            return acc;
          }, initialCounts);

          setAttackCounts(counts);
        })
        .catch((error) => console.error('Error fetching attackers data:', error));
    };

    fetchAttackers();

    const intervalId = setInterval(fetchAttackers, 1000);

    return () => clearInterval(intervalId);
  }, []);


  
  // jQuery
  // ใช้ jQuery สำหรับแสดง/ซ่อนข้อมูล
  useEffect(() => {
    $(".Classification").on("click", () => {
      $(".container-item").slideToggle(300);
    });
    // Cleanup เพื่อป้องกันปัญหา event listener ซ้ำซ้อน
    return () => {
      $(".Classification").off("click");
    };
  }, []);




  return (
    <div>
      <p className="Classification">Classification</p>
      <div className="container-item">
        <div className="table">
          <p>DDoS: {attackCounts.DDoS}</p>
          <p>SQL Injection: {attackCounts["SQL Injection"]}</p>
          <p>Phishing: {attackCounts.Phishing}</p>
          <p>Malware: {attackCounts.Malware}</p>
          <p>Ransomware: {attackCounts.Ransomware}</p>
          <p>Unknown: {attackCounts.Unknown}</p>
        </div>
      </div>
    </div>
  );
}

export default Classification;
