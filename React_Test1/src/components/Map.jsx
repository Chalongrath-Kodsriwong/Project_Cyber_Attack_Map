import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import attackersData from "../assets/attackers.json"; // Import attackers JSON
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set()); // Track processed IDs
  const [lineDrawn, setLineDrawn] = useState(false); // Track if a line has been drawn to self location

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

    // Draw countries on the map
    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#f5f5f5") // Light white/gray for landmass
      .attr("stroke", "#000") // Lighter gray for country borders
      .attr("stroke-width", 0.5);

    const renderNewMarkers = (newData, selfLocation) => {
      newData.forEach((entry) => {
        // Skip entries that have already been processed
        if (processedIds.has(entry.id)) return;

        const { latitude, longitude, id, type, country } = entry;
        if (!latitude || !longitude) return; // Skip invalid data
        const [x, y] = projection([longitude, latitude]);

        // If self location is available, draw lines
        if (selfLocation) {
          const [selfX, selfY] = projection(selfLocation);
          const lineColor = getColorByType(type);

          // Define a curved path (arc) between the points
          const curve = d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveBasis); // Smooth curve

          const midX = (x + selfX) / 2; // Midpoint for curvature
          const midY = (y + selfY) / 2 - 50; // Elevate midpoint for arc

          const lineData = [
            [x, y],
            [midX, midY],
            [selfX, selfY],
          ];

          // Add animated curved line
          svg
            .append("path")
            .datum(lineData)
            .attr("d", curve)
            .attr("stroke", lineColor) // Line color based on type
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("stroke-linecap", "round") // Rounded line ends
            .attr("stroke-dasharray", function () {
              return this.getTotalLength();
            })
            .attr("stroke-dashoffset", function () {
              return this.getTotalLength();
            })
            .transition()
            .duration(3000)
            .ease(d3.easeQuadInOut)
            .attr("stroke-dashoffset", 0)
            .style("opacity", 0)
            .on("end", function () {
              // Remove the line immediately after animation
              d3.select(this).remove();

              // After the line reaches the self-location, trigger the notification ring
              setLineDrawn(true);
            });
        }

        // Add markers and labels for attackers
        const marker = svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr("fill", getColorByType(type))
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        // Apply fade-out transition to non-self markers
        if (entry.id !== "self") {
          marker
            .transition()
            .duration(5000) // Fade out duration
            .style("opacity", 0)
            .on("end", function () {
              d3.select(this).remove(); // Remove the marker after fading out
            });
        }

        const text = svg
          .append("text")
          .attr("x", x + 10)
          .attr("y", y + 5)
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(country || "Unknown Country");

        // Apply fade-out transition to non-self markers
        if (entry.id !== "self") {
          text
            .transition()
            .duration(3000) // Fade out duration
            .style("opacity", 0)
            .on("end", function () {
              d3.select(this).remove(); // Remove the label after fading out
            });
        }

        // Mark this ID as processed to avoid duplication
        setProcessedIds((prev) => new Set(prev).add(id));
      });

      // Add a notification ring around the self-location marker only after the line has been drawn
      if (selfLocation && lineDrawn) {
        const [selfX, selfY] = projection(selfLocation);

        // Add the notification ring (pulsing effect)
        svg
          .append("circle")
          .attr("cx", selfX)
          .attr("cy", selfY)
          .attr("r", 8)
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("class", "notification-ring") // Use class to apply CSS animation
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("r", 12)
          .style("opacity", 0)
          .transition()
          .duration(0)
          .ease(d3.easeLinear)
          .attr("r", 8)
          .style("opacity", 1)
          .on("end", function () {
            d3.select(this).transition().duration(1000).ease(d3.easeLinear).attr("r", 12).style("opacity", 0);
          });
      }
    };

    // Function to get color based on type
    const getColorByType = (type) => {
      switch (type) {
        case "Botnet":
          return "blue";
        case "Trojan":
          return "green";
        case "Self":
          return "red";
        default:
          return "orange";
      }
    };

    // Fetch self location first to display it
    fetch("http://www.geoplugin.net/json.gp")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const { geoplugin_request, geoplugin_latitude, geoplugin_longitude, geoplugin_countryName } = data;

        const selfData = {
          id: "self",
          ip: geoplugin_request || "Unknown IP",
          country: geoplugin_countryName || "Unknown Country",
          latitude: parseFloat(geoplugin_latitude) || 0,
          longitude: parseFloat(geoplugin_longitude) || 0,
          type: "Self",
        };

        // Add self data to attackersData and render it first
        attackersData.unshift(selfData); // Insert at the beginning

        // Render self location first before others
        renderNewMarkers(attackersData, [selfData.longitude, selfData.latitude]);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
        renderNewMarkers(attackersData, null);
      });
  }, [processedIds, lineDrawn]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
