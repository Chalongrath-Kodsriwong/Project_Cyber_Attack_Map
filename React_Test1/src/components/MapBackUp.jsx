import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import attackersData from "../assets/attackers.json"; // Import attackers JSON
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set()); // Track processed IDs
  const [userLocation, setUserLocation] = useState(null); // Store user location

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
  
    // Create a tooltip for country names
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("font-size", "12px");
  
    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#d3d3d3")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        // Highlight the country
        d3.select(event.currentTarget).attr("fill", "rgb(12, 50, 68)");
  
        // Show tooltip with country name
        tooltip.style("visibility", "visible").text(d.properties.name); // Display the country's name
      })
      .on("mousemove", (event) => {
        // Move the tooltip to follow the mouse
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        // Reset country color and hide tooltip
        d3.select(event.currentTarget).attr("fill", "#d3d3d3");
  
        tooltip.style("visibility", "hidden");
      });
  
    // Function to create Ripple Effect
    const createRippleEffect = (x, y) => {
      const ripple = svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("opacity", 1);
  
      ripple
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("r", 30) // Expand circle
        .attr("opacity", 0) // Fade out
        .remove();
    };
  
    // Function to add blinking effect at self-location
    const addBlinkingEffect = (x, y) => {
      const blinkCircle = svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .attr("fill", "red")
        .attr("opacity", 0.8);
  
      blinkCircle
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("opacity", 0)
        .transition()
        .duration(500)
        .attr("opacity", 0.8)
        .on("end", () => blinkCircle.remove()); // Remove circle after blinking
    };
  
    // Function to render markers and lines for new data
    const renderNewMarkers = (newData) => {
      newData.forEach((entry) => {
        if (processedIds.has(entry.id)) return; // Skip already processed IDs
  
        const { latitude, longitude, type, country, id } = entry;
  
        const [x, y] = projection([longitude, latitude]);
  
        const attackerCircle = svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr(
            "fill",
            type === "Self"
              ? "red"
              : type === "Botnet"
              ? "orange"
              : type === "Trojan"
              ? "yellow"
              : "green"
          )
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
  
        const attackerCircle2 = svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr(
            "fill",
            type === "Self"
              ? "blue"
              : type === "Botnet"
              ? "orange"
              : type === "Trojan"
              ? "yellow"
              : "green"
          )
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
  
        const label = svg
          .append("text")
          .attr("x", x + 8)
          .attr("y", y + 4)
          .attr("font-size", "10px")
          .attr("fill", "black")
          .text(country);
  
        // Mark as processed
        setProcessedIds(new Set(processedIds.add(id)));
      });
    };
  
    // Render the user's location
    const renderUserLocation = (latitude, longitude) => {
      const [x, y] = projection([longitude, latitude]);
  
      // Add a marker for the user's location
      const userMarker = svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 7)
        .attr("fill", "blue")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);
  
      const userLabel = svg
        .append("text")
        .attr("x", x + 10)
        .attr("y", y + 5)
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("You are here");
  
      addBlinkingEffect(x, y); // Add blinking effect for user location
      
    };
  
    // Fetch user's location using geoplugin.net API
    fetch("http://www.geoplugin.net/json.gp")
      .then((response) => response.json())
      .then((data) => {
        const { geoplugin_latitude, geoplugin_longitude } = data;
        setUserLocation({
          latitude: parseFloat(geoplugin_latitude),
          longitude: parseFloat(geoplugin_longitude),
        });
        renderUserLocation(geoplugin_latitude, geoplugin_longitude); // Render user location once fetched
        fetchNewData(); // Start fetching attacker data
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
      });
  
    // Function to fetch new data periodically
    const fetchNewData = () => {
      setTimeout(() => {
        renderNewMarkers(attackersData); // Render new attacker markers
        fetchNewData(); // Recurse to fetch again
      }, 2000);
    };
  }, [processedIds]);
  
  return (
    <div>
      <svg ref={mapRef} />
    </div>
  );
  };
  

export default Map;
