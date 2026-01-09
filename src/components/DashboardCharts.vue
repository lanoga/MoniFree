<template>
  <div class="dashboard-container">
    <div class="chart-wrapper">
      <LineChart :chartData="lineData" :chartOptions="commonOptions" />
    </div>

    <div class="chart-wrapper">
      <BarChart :chartData="barData" :chartOptions="commonOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// vue-chartjs components
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import { defineAsyncComponent } from "vue";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// Dynamically import for better bundling
const LineChart = defineAsyncComponent(() =>
  import("vue-chartjs").then((m) => m.Line)
);

const BarChart = defineAsyncComponent(() =>
  import("vue-chartjs").then((m) => m.Bar)
);

// Line chart data
const lineData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      backgroundColor: "#42A5F5",
      borderColor: "#1E88E5",
      fill: false,
      tension: 0.4,
      data: [10, 30, 40, 20, 60, 50],
    },
  ],
});

// Bar chart data
const barData = ref({
  labels: ["Apples", "Oranges", "Bananas", "Kiwis"],
  datasets: [
    {
      label: "Fruit Count",
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      data: [12, 19, 3, 5],
    },
  ],
});

// Shared chart options
const commonOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Dashboard Chart",
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#333",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#333",
      },
    },
  },
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 300px; /* Adjust for mobile/desktop */
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Larger on wide screens */
@media (min-width: 768px) {
  .chart-wrapper {
    height: 400px;
  }
}
</style>
