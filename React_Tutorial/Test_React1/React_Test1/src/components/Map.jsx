import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import topojsonData from '../assets/110m.json'; // Import TopoJSON directly
import attackersData from '../assets/attackers.json'; // Import attackers JSON

const Map = () => {
  const mapRef = useRef();

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3.select(mapRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const projection = d3.geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Process the imported TopoJSON data
    const countries = feature(topojsonData, topojsonData.objects.countries);

    // Render the map
    svg.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#d3d3d3')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);

    // Function to render markers
    const renderMarkers = (data) => {
      data.forEach((entry) => {
        const { latitude, longitude, type, country, region } = entry;
        const [x, y] = projection([longitude, latitude]);

        // Add a marker
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 5)
          .attr('fill', type === 'Self' ? 'blue' : type === 'Botnet' ? 'red' : 'orange') // Self = Blue
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        // Add a label
        svg.append('text')
          .attr('x', x + 8)
          .attr('y', y + 4)
          .attr('font-size', '10px')
          .attr('fill', 'black')
          .text(`${country}, ${region}`);
      });
    };

    // Load user's current location and update JSON
    fetch('https://ipinfo.io/json')
      .then((response) => response.json())
      .then((data) => {
        const { ip, loc, country, region } = data;
        const [latitude, longitude] = loc.split(',').map(Number);

        // Add current user's location to attackers data
        const selfData = {
          ip,
          country,
          region,
          latitude,
          longitude,
          type: 'Self',
        };

        attackersData.push(selfData); // Update attackers data in memory

        // Render all markers
        renderMarkers(attackersData);

        // Save updated attackers data to file (requires a backend endpoint)
        fetch('/saveAttackers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attackersData),
        }).catch((error) => console.error('Error saving attackers data:', error));
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
        // Render markers without self-data if fetch fails
        renderMarkers(attackersData);
      });
  }, []);

  return <svg ref={mapRef} style={{ width: '100%', height: '900px' }}></svg>;
};

export default Map;
