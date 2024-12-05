import React, { useEffect, useState } from 'react';
import './css/Data_Attack.css';
import $ from 'jquery'; 
import { setupDataAttackerAnimation } from './JS/data_attackerFun'; 

function Data_Attack() {
  const [attackers, setAttackers] = useState([]); // State for storing attacker data

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fetch the data from attackers.json located in public folder
      fetch('/attackers.json') // ใช้เส้นทางจาก public folder
        .then((response) => response.json())
        .then((data) => {
          const sortedData = data.sort((a, b) => b.id - a.id); // Sort by ID descending
          setAttackers(sortedData); // Update attackers state with sorted data
        })
        .catch((error) => console.error('Error fetching updated attackers data:', error));
    }, 1000); // Fetch new data every 1 second

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupDataAttackerAnimation(); // เรียกใช้งาน animation
  }, []);

  return (
    <div className='On_container'>
      <p className='DataAttacker_log'>Data_Attacker_Log</p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            <div className='fa timestamp'>Timestamp</div>
            <div className='fa description'>Description</div>
            <div className='fa country_name'>Country</div>
            <div className='fa hostname'>Hostname</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => (
              <div key={index} className="row">
                <div className="fa timestamp">{attacker.timestamp || 'N/A'}</div>
                <div className="fa description">{attacker.description || 'N/A'}</div>
                <div className="fa country_name">{attacker.country_name || 'Unknown'}</div>
                <div className="fa hostname">{attacker.hostname || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data_Attack;
