import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import topojsonData from '../assets/110m.json'; // Import TopoJSON
import attackersData from '../assets/attackers.json'; // Import attackers JSON
import './css/Map.css';

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set()); // Track processed IDs

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

    const countries = feature(topojsonData, topojsonData.objects.countries);

    svg.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#d3d3d3')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);

    // Function to render markers and lines for new data
    const renderNewMarkers = (newData, selfLocation) => {
      newData.forEach((entry) => {
        if (processedIds.has(entry.id)) return; // Skip already processed IDs
    
        const { latitude, longitude, type, country, id } = entry;
    
        const [x, y] = projection([longitude, latitude]);
    
        const attackerCircle = svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 5)
          .attr('fill', type === 'Self' ? 'blue' : type === 'Botnet' ? 'orange' : type === 'Trojan' ? 'yellow' : 'green')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
    
        const label = svg.append('text')
          .attr('x', x + 8)
          .attr('y', y + 4)
          .attr('font-size', '10px')
          .attr('fill', 'black')
          .text(country);
    
        if (selfLocation) {
          const [selfX, selfY] = projection(selfLocation);
    
          const lineGenerator = d3.line()
            .curve(d3.curveBundle.beta(0.5)); // Use curveBundle for smoother curves
    
          const controlPoint1 = [
            (x + selfX) / 2 + 50,
            (y + selfY) / 2 - 50,
          ];
    
          const controlPoint2 = [
            (x + selfX) / 2 - 50,
            (y + selfY) / 2 - 100,
          ];
    
          const lineData = [
            [x, y],
            controlPoint1,
            controlPoint2,
            [selfX, selfY],
          ];
    
          // Add a gradient to the line
          const gradientId = `gradient-${id}`;
          const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');
    
          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'red');
    
          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'orange');
    
          const line = svg.append('path')
            .datum(lineData)
            .attr('d', lineGenerator)
            .attr('stroke', `url(#${gradientId})`) // Use gradient
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .attr('stroke-dasharray', function () {
              return this.getTotalLength();
            })
            .attr('stroke-dashoffset', function () {
              return this.getTotalLength();
            });
    
          line.transition()
            .duration(3000)
            .ease(d3.easeCubicInOut) // Smooth easing
            .attr('stroke-dashoffset', 0)
            .on('end', () => {
              line.transition()
                .duration(2000)
                .attr('opacity', 0)
                .remove();
    
              if (type !== 'Self') {
                attackerCircle.transition()
                  .duration(2000)
                  .delay(500)
                  .attr('opacity', 0)
                  .remove();
    
                label.transition()
                  .duration(2000)
                  .delay(500)
                  .attr('opacity', 0)
                  .remove();
              }
            });
        }
    
        setProcessedIds((prev) => new Set(prev).add(id));
      });
    };
    

    fetch('https://ipinfo.io/json')
      .then((response) => response.json())
      .then((data) => {
        const { ip, loc, country } = data;
        const [latitude, longitude] = loc.split(',').map(Number);

        const selfData = {
          id: 'self', // Use a fixed ID for self
          ip,
          country,
          latitude,
          longitude,
          type: 'Self',
        };

        attackersData.push(selfData);

        renderNewMarkers(attackersData, [longitude, latitude]);

        fetch('/saveAttackers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attackersData),
        }).catch((error) => console.error('Error saving attackers data:', error));
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
        renderNewMarkers(attackersData, null);
      });
  }, [processedIds]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
