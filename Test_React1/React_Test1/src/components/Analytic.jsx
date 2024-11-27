import React, { useState } from 'react';
import Chart from 'react-apexcharts';

import '../components/css/analytic.css';


// import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const cardMetrics = [
    { title: "CLICKS", value: 1213, color: "#00c6ff, #0072ff" },
    { title: "VIEWS", value: 422, color: "#17ead9, #6078ea" },
    { title: "LEADS", value: 311, color: "#f7971e, #ff0844" },
    { title: "SALES", value: 22, color: "#7b4397, #dc2430" },
  ];
  
  const sparklineOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      enabled: false,
    },
    colors: ["#fff"],
  };
  
  const sparklineData = [
    { data: [10, 20, 15, 30, 25, 35, 28] },
    { data: [5, 15, 10, 25, 20, 30, 18] },
    { data: [8, 12, 18, 22, 16, 28, 20] },
    { data: [2, 5, 8, 12, 15, 20, 18] },
  ];
  



  const columnChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    title: {
      text: "Load Average",
      style: {
        fontSize: "14px",
        color: "#fff",
      },
    },
    colors: ["#FF9933"],
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
  };

  const columnChartData = [
    {
      name: "Load Average",
      data: [
        [new Date().getTime(), 10],
        [new Date().getTime() + 60000, 20],
        [new Date().getTime() + 120000, 35],
        [new Date().getTime() + 180000, 50],
        [new Date().getTime() + 240000, 70],
      ],
    },
  ];

  const lineChartOptions = {
    chart: {
      type: "line",
      height: 350,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    title: {
      text: "Processes",
      style: {
        fontSize: "14px",
        color: "#fff",
      },
    },
    colors: ["#17ead9", "#f02fc2"],
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
  };

  const lineChartData = [
    {
      name: "Running",
      data: [
        [new Date().getTime(), 50],
        [new Date().getTime() + 60000, 80],
        [new Date().getTime() + 120000, 100],
        [new Date().getTime() + 180000, 150],
      ],
    },
    {
      name: "Waiting",
      data: [
        [new Date().getTime(), 20],
        [new Date().getTime() + 60000, 40],
        [new Date().getTime() + 120000, 70],
        [new Date().getTime() + 180000, 100],
      ],
    },
  ];

  const radialChartOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "14px",
            color: "#fff",
          },
          value: {
            fontSize: "14px",
            color: "#fff",
          },
        },
      },
    },
    labels: ["Device 1", "Device 2"],
    colors: ["#FF9933", "#17ead9"],
  };

  const radialChartData = [46, 74];

  

  
  return (
    <div>
      <div className="test">
        <div className="row test">
      {cardMetrics.map((metric, index) => (
        <div className="col-md-3" key={index}>
          <div
            className="p-3 d-flex align-items-center justify-content-between D5 "
            style={{
              background: `linear-gradient(to right, ${metric.color})`,
              borderRadius: "10px",
              color: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div>
              <h4>{metric.value}</h4>
              <p style={{ fontSize: "14px", margin: 0 }}>{metric.title}</p>
            </div>
            <div style={{ width: "50px" }}>
              <Chart
                options={sparklineOptions}
                series={[sparklineData[index]]}
                type="line"
                height={40}
                width={80}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div className="container-fluid" style={{ background: "#1B213B",  color: "#fff" }}>
      <div className="row">
        <div className="col-md-6">
          <div className="p-3" style={{ background: "#262D47", borderRadius: "10px" }}>
            <Chart options={columnChartOptions} series={columnChartData} type="line" height={300} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3" style={{ background: "#262D47", borderRadius: "10px" }}>
            <Chart options={lineChartOptions} series={lineChartData} type="line" height={300} />
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="p-3" style={{ background: "#262D47", borderRadius: "10px" }}>
            <Chart options={radialChartOptions} series={radialChartData} type="radialBar" height={300} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3" style={{ background: "#262D47", borderRadius: "10px" }}>
            <div className="d-flex justify-content-between">
              <div>
                <h6 style={{ color: "#fff" }}>Process 1</h6>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{ width: "46%", background: "#FF9933" }}>
                    46%
                  </div>
                </div>
              </div>
              <div>
                <h6 style={{ color: "#fff" }}>Process 2</h6>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{ width: "22%", background: "#17ead9" }}>
                    22%
                  </div>
                </div>
              </div>
              <div>
                <h6 style={{ color: "#fff" }}>Process 3</h6>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{ width: "74%", background: "#f02fc2" }}>
                    74%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    
  );
};


export default Dashboard;