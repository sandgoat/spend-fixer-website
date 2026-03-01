<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const checking   = [3200, 3450, 2900, 3800, 3600, 3900]
const savings    = [4800, 5100, 5300, 5600, 5900, 6200]
const investment = [4000, 4300, 4700, 5100, 5600, 7900]

const totalNetWorth = months.map((_, i) => checking[i] + savings[i] + investment[i])

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Investment',
      data: investment,
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.3)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    },
    {
      label: 'Savings',
      data: savings,
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.25)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    },
    {
      label: 'Checking',
      data: checking,
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    },
    {
      label: 'Total',
      data: totalNetWorth,
      borderColor: '#1f2937',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [4, 4],
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#1f2937',
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
      labels: { boxWidth: 12, font: { size: 11 } },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: $${Number(ctx.parsed.y).toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      stacked: false,
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (v) => `$${(Number(v) / 1000).toFixed(0)}k`,
      },
    },
  },
}

const growth = computed(() => {
  const start = totalNetWorth[0]
  const end = totalNetWorth[totalNetWorth.length - 1]
  return ((end - start) / start * 100).toFixed(1)
})
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5">
    <div class="mb-4 flex items-start justify-between">
      <div>
        <h3 class="font-display text-base font-bold text-brand-950">Net Worth Over Time</h3>
        <p class="text-xs text-gray-400">Checking + Savings + Investments</p>
      </div>
      <div class="rounded-lg bg-brand-50 px-3 py-1.5 text-right">
        <p class="text-xs text-gray-500">6-mo growth</p>
        <p class="text-sm font-bold text-brand-700">+{{ growth }}%</p>
      </div>
    </div>
    <Line :data="chartData" :options="chartOptions" />

    <div class="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
      <div class="text-center">
        <p class="text-xs text-gray-400">Checking</p>
        <p class="text-sm font-bold text-emerald-400">${{ checking[checking.length - 1].toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-400">Savings</p>
        <p class="text-sm font-bold text-teal-600">${{ savings[savings.length - 1].toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-400">Investments</p>
        <p class="text-sm font-bold text-emerald-700">${{ investment[investment.length - 1].toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
