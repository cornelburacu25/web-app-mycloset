import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;

  @media (max-width: 768px) {
    max-width: 400px;
    height: 300px;
  }

  @media (max-width: 500px) {
    max-width: 300px;
    height: 300px;
  }
`;

const MostOwnedMaterialsChart = ({ userId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await fetch(`http://localhost:9000/mycloset/most-owned-materials/${userId}`);
      const data = await response.json();
      processChartData(data.mostOwnedMaterials);
    };

    fetchChartData();
  }, [userId]);

  const processChartData = (data) => {
    const materials = data.map(item => item.material);
    const counts = data.map(item => item.count);

    const chartColors = {
        cotton: '#FF6384',      
        polyester: '#36A2EB',   
        wool: '#FFCE56',       
        denim: '#4BC0C0',      
        leather: '#9966FF',    
        nylon: '#FF9F40',     
        spandex: '#C9CBCF',    
        silk: '#FF5733',       
        linen: '#33FF57',      
        velvet: '#8A2BE2',      
        tencel: '#00FA9A',     
        satin: '#FFD700',       
        cashmere: '#DC143C',    
        other: '#CCCCCC'        
      };

    const backgroundColors = materials.map(material => chartColors[material.toLowerCase()] || '#000000');

    setChartData({
      labels: materials,
      datasets: [
        {
          data: counts,
          backgroundColor: backgroundColors,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
          display: true,
          text: 'Most Owned Materials',
          font: {
            size: 16
          }
        }
      }
  };

  return chartData ? (
    <ChartContainer>
      <Pie data={chartData} options={options} />
    </ChartContainer>
  ) : (
    <div>Loading...</div>
  );
};

export default MostOwnedMaterialsChart;
