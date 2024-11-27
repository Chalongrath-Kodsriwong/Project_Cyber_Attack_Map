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
    }, []);
  
    return <svg ref={mapRef} style={{ width: '100%', height: '670px' }}></svg>;
  };
  
  export default Map;
  