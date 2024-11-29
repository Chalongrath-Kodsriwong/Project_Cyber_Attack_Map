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

    // Create a tooltip for country names
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('visibility', 'hidden')
      .style('font-size', '12px');

    svg.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#d3d3d3')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d) => {
        // Highlight the country
        d3.select(event.currentTarget)
          .attr('fill', '#ffcc00');

        // Show tooltip with country name
        tooltip.style('visibility', 'visible')
          .text(d.properties.name); // Display the country's name
      })
      .on('mousemove', (event) => {
        // Move the tooltip to follow the mouse
        tooltip.style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', (event) => {
        // Reset country color and hide tooltip
        d3.select(event.currentTarget)
          .attr('fill', '#d3d3d3');

        tooltip.style('visibility', 'hidden');
      });

    // Function to create Ripple Effect
    const createRippleEffect = (x, y) => {
      const ripple = svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('opacity', 1);

      ripple.transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('r', 30) // Expand circle
        .attr('opacity', 0) // Fade out
        .remove();
    };

    // Function to add blinking effect at self-location
    const addBlinkingEffect = (x, y) => {
      const blinkCircle = svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 10)
        .attr('fill', 'blue')
        .attr('opacity', 0.8);

      blinkCircle.transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 0.8)
        .on('end', () => blinkCircle.remove()); // Remove circle after blinking
    };

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
            .attr('stop-color', 'red')
            .attr('stop-opacity', 0);

          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'orange')
            .attr('stop-opacity', 1);

          const line = svg.append('path')
            .datum(lineData)
            .attr('d', lineGenerator)
            .attr('stroke', `url(#${gradientId})`)
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
            .ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0)
            .on('end', () => {
              line.transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr('opacity', 0)
                .remove();

              if (type !== 'Self') {
                attackerCircle.transition()
                  .duration(2000)
                  .ease(d3.easeLinear)
                  .attr('opacity', 0)
                  .remove();

                label.transition()
                  .duration(2000)
                  .ease(d3.easeLinear)
                  .attr('opacity', 0)
                  .remove();
              }

              if (type === 'Self') {
                createRippleEffect(selfX, selfY);
              } else {
                addBlinkingEffect(selfX, selfY);
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
          id: 'self',
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
