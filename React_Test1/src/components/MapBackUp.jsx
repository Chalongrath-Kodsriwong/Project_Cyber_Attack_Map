import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json";
import attackersData from "../assets/attackers.json"; // นำเข้าไฟล์ attackers.json
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();

  // Fix Position: ตั้งค่าพิกัดที่ต้องการ
  const fixedLocation = { latitude: 13.736717, longitude: 100.523186 }; // Example: Bangkok, Thailand
  const fixedLocation2 = { latitude: 1.36170, longitude: 103.82226 }; // Example: Bangkok, Thailand

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 40 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    const countries = feature(topojsonData, topojsonData.objects.countries);

    // วาดแผนที่
    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);

    // แสดงตำแหน่งคงที่บนแผนที่
    const [x, y] = projection([fixedLocation.longitude, fixedLocation.latitude]);
    const [x2, y2] = projection([fixedLocation2.longitude, fixedLocation2.latitude]);

//  ตำแหน่งของ Server Thailand
    svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 6)
      .attr("fill", "blue")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    svg
      .append("text")
      .attr("x", x + 10)
      .attr("y", y)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text("Fixed Position");  

//  ตำแหน่งของ Server Sigapro
    svg
      .append("circle")
      .attr("cx", x2)
      .attr("cy", y2)
      .attr("r", 6)
      .attr("fill", "blue")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    svg
      .append("text")
      .attr("x", x2 + 10)
      .attr("y", y2)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text("Fixed Position");

    // แสดงตำแหน่งจาก attackers.json
    attackersData.forEach((attacker) => {
      const { _source } = attacker;
      const { GeoLocation } = _source;

      // ตรวจสอบว่ามีค่าพิกัดหรือไม่
      if (GeoLocation && GeoLocation.location) {
        const { lat, lon } = GeoLocation.location;
        const [x, y] = projection([lon, lat]);

        // ใช้สีต่างๆ ตามระดับความรุนแรงหรือประเภทการโจมตี
        let color;
        switch (_source.rule.description) {
          case "IPDB Block ip":
            color = "red";
            break;
          // เพิ่มเงื่อนไขอื่นๆ ตามที่คุณต้องการ
          default:
            color = "gray";
        }

        // วาดวงกลมสำหรับ attackers
        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 6)
          .attr("fill", color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5);

        // แสดงชื่อประเทศจาก GeoLocation
        svg
          .append("text")
          .attr("x", x + 10)
          .attr("y", y)
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(GeoLocation.country_name || "Unknown");
      }
    });
  }, []);

  return <svg ref={mapRef}></svg>;
};

export default Map;
