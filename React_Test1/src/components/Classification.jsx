import React, { useEffect, useState } from 'react';
import './css/Classification.css';
import { setupClassificationAnimation } from './JS/classification_Fun';

function Classification() {
  const [attackCounts, setAttackCounts] = useState({
    "IPDB Block ip": 0,
    "SSH Brute Force Attack": 0,
    "HTTP DoS Attack": 0,
    "Port Scan Detected": 0,
    "Ping Flood Detected": 0,
    Unknown: 0,
  });

  useEffect(() => {
    const fetchAttackers = () => {
      fetch('/src/assets/attackers.json')
        .then((response) => response.json())
        .then((data) => {
          const initialCounts = {
            "IPDB Block ip": 0,
            "SSH Brute Force Attack": 0,
            "HTTP DoS Attack": 0,
            "Port Scan Detected": 0,
            "Ping Flood Detected": 0,
            Unknown: 0,
          };

          const counts = data.reduce((acc, attacker) => {
            const description =
              attacker._source?.rule?.description || "Unknown";
            if (acc[description] !== undefined) {
              acc[description] += 1;
            } else {
              acc.Unknown += 1;
            }
            return acc;
          }, initialCounts);

          setAttackCounts(counts);
        })
        .catch((error) =>
          console.error('Error fetching attackers data:', error)
        );
    };

    // Fetch attackers data initially
    fetchAttackers();

    // Fetch attackers data every 1 second
    const intervalId = setInterval(fetchAttackers, 1000);

    return () => clearInterval(intervalId); // Cleanup interval
  }, []);

  // เรียกฟังก์ชัน Animation จาก classification.js
  useEffect(() => {
    setupClassificationAnimation();
  }, []);

  return (
    <div>
      <div className="border">
        <p className="Classification">Classification</p>
        <div className="container-item">
          <p>IPDB Block ip: {attackCounts["IPDB Block ip"]}</p>
          <p>SSH Brute Force Attack: {attackCounts["SSH Brute Force Attack"]}</p>
          <p>HTTP DoS Attack: {attackCounts["HTTP DoS Attack"]}</p>
          <p>Port Scan Detected: {attackCounts["Port Scan Detected"]}</p>
          <p>Ping Flood Detected: {attackCounts["Ping Flood Detected"]}</p>
          <p>Unknown: {attackCounts.Unknown}</p>
        </div>
      </div>
    </div>
  );
}

export default Classification;
