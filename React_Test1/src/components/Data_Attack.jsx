import React, { useEffect, useState } from 'react';
import './css/Data_Attack.css';
import $ from 'jquery';
import { setupDataAttackerAnimation } from './JS/data_attackerFun';

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);

  useEffect(() => {
    const fetchAttackers = () => {
      fetch('/src/assets/attackers.json')
        .then((response) => response.json())
        .then((data) => {
          // Sort data by ID in descending order
          const sortedData = data.sort((a, b) => b.id - a.id);
          setAttackers(sortedData);
        })
        .catch((error) =>
          console.error('Error fetching updated attackers data:', error)
        );
    };

    // Fetch data initially
    fetchAttackers();

    // Fetch new data every 1 second
    const intervalId = setInterval(fetchAttackers, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    setupDataAttackerAnimation();
  }, []);

  return (
    <div className="On_container">
      <p className="DataAttacker_log">Data_Attacker_Log</p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            {/* <div className="fa id">ID Agent</div> */}
            <div className="fa timestamp">Timestamp</div>
            <div className="fa description">Attack Type</div>
            <div className="fa city_name&region_name">Attack Country</div>
            <div className="fa hostname">Target Server</div>
            <div className="fa id">ID Agent</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => (
              <div key={index} className="row">
                {/* <div className="fa id">{attacker._source?.agent?.id || 'N/A'}</div> */}
                <div className="fa timestamps" >
                  {attacker._source?.predecoder?.timestamp || 'N/A'}
                </div>

                <div className="fa description">
                  {attacker._source?.rule?.description || 'N/A'}
                </div>

                <div className="fa city_name&region_name">
                  {`${attacker._source?.GeoLocation?.city_name || 'N/A'}, ${
                    attacker._source?.GeoLocation?.region_name || 'N/A'
                  }`}
                </div>

                <div className="fa hostname">
                  {attacker._source?.predecoder?.hostname || 'N/A'}
                </div>

                <div className="fa id">{attacker._source?.agent?.id || 'N/A'}</div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data_Attack;
