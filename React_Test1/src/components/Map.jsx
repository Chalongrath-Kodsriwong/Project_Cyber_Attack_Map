import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json";
import attackersData from "../assets/attackers.json";
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set());

  useEffect(() => {
    const width = 1000;
    const height = 300;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 50 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countries = feature(topojsonData, topojsonData.objects.countries);

    // Draw the map once
    svg
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("fill", "#f5f5f5")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5);

    const renderMarkers = (data, selfLocation) => {
      const newEntries = data.filter((entry) => !processedIds.has(entry.id));

      // Mark IDs as processed
      setProcessedIds((prev) => {
        const updated = new Set(prev);
        newEntries.forEach((entry) => updated.add(entry.id));
        return updated;
      });

      const markers = svg.selectAll(".marker").data(newEntries, (d) => d.id);

      // Add new markers
      markers
        .enter()
        .append("circle")
        .attr("class", "marker")
        .attr("r", 5)
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("fill", (d) =>
          d.type === "Botnet"
            ? "orange"
            : d.type === "Trojan"
            ? "yellow"
            : d.type === "Self"
            ? "red"
            : "green"
        )
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Draw lines to selfLocation
      if (selfLocation) {
        const [selfX, selfY] = projection(selfLocation);

        svg
          .selectAll(".line")
          .data(newEntries.filter((d) => d.type !== "Self"))
          .enter()
          .append("line")
          .attr("class", "line")
          .attr("x1", (d) => projection([d.longitude, d.latitude])[0])
          .attr("y1", (d) => projection([d.longitude, d.latitude])[1])
          .attr("x2", selfX)
          .attr("y2", selfY)
          .attr("stroke", "orange")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5");
      }
    };

    const fetchSelfLocation = async () => {
      try {
        const response = await fetch("http://www.geoplugin.net/json.gp");
        const data = await response.json();
        const selfData = {
          id: "self",
          ip: data.geoplugin_request || "Unknown IP",
          country: data.geoplugin_countryName || "Unknown Country",
          latitude: parseFloat(data.geoplugin_latitude) || 0,
          longitude: parseFloat(data.geoplugin_longitude) || 0,
          type: "Self",
        };

        // Add self marker first
        renderMarkers([selfData], [selfData.longitude, selfData.latitude]);

        // Add remaining markers
        renderMarkers(attackersData, [selfData.longitude, selfData.latitude]);
      } catch (error) {
        console.error("Error fetching self location:", error);
        renderMarkers(attackersData, null);
      }
    };

    fetchSelfLocation();
  }, [processedIds]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
