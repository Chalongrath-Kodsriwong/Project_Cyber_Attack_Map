import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import topojsonData from '../assets/110m.json'; // Import TopoJSON directly

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

    // Fetch the user's location using an IP-based geolocation API
    fetch('https://ipinfo.io/json')
      .then((response) => response.json())
      .then((data) => {
        const [latitude, longitude] = data.loc.split(',').map(Number); // loc ในรูปแบบ "lat, lon"

        // ตรวจสอบค่าที่ได้
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // Project latitude and longitude to map coordinates
        const [x, y] = projection([longitude, latitude]);

        // Add a marker for the user's location
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 4)
          .attr('fill', 'red')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);

        // Add a label for the user's location
        svg.append('text')
          .attr('x', x + 10)
          .attr('y', y + 5)
          .attr('font-size', '8px')
          .attr('fill', 'white')
          .text('You are here');
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  }, []);

  return <svg ref={mapRef} style={{ width: '100%', height: '900px' }}></svg>;
};

export default Map;
