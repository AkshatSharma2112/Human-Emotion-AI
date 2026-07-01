import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PersonalityTrendChart({ history }) {
  if (!history || history.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
        📊 Take at least 2 assessments to see personality trends
      </div>
    );
  }

  const chronological = [...history].reverse();
  const labels = chronological.map((item, idx) => {
    const date = new Date(item.timestamp);
    return `Week ${item.week || idx + 1}\n${date.toLocaleDateString()}`;
  });

  const datasets = [
    {
      label: 'Openness',
      data: chronological.map(item => item.scores.openness),
      borderColor: '#2196F3',
      backgroundColor: '#2196F3',
      tension: 0.3,
      fill: false
    },
    {
      label: 'Conscientiousness',
      data: chronological.map(item => item.scores.conscientiousness),
      borderColor: '#4CAF50',
      backgroundColor: '#4CAF50',
      tension: 0.3,
      fill: false
    },
    {
      label: 'Extraversion',
      data: chronological.map(item => item.scores.extraversion),
      borderColor: '#FF9800',
      backgroundColor: '#FF9800',
      tension: 0.3,
      fill: false
    },
    {
      label: 'Agreeableness',
      data: chronological.map(item => item.scores.agreeableness),
      borderColor: '#9C27B0',
      backgroundColor: '#9C27B0',
      tension: 0.3,
      fill: false
    },
    {
      label: 'Neuroticism',
      data: chronological.map(item => item.scores.neuroticism),
      borderColor: '#F44336',
      backgroundColor: '#F44336',
      tension: 0.3,
      fill: false
    }
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}/100`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Score (%)' },
        ticks: { callback: (value) => value + '%' }
      },
      x: {
        title: { display: true, text: 'Assessment Date' }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px', marginTop: 20 }}>
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
}

export default PersonalityTrendChart;