<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js'

ChartJS.register(BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const income  = [5800, 5800, 6200, 5800, 5800, 6050]
const expenses = [4120, 4680, 5340, 3980, 4450, 4215]
const netSavings = income.map((inc, i) => inc - expenses[i])

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Income',
      data: income,
      backgroundColor: 'rgba(5, 150, 105, 0.85)',
      borderRadius: 4,
      order: 2,
    },
    {
      label: 'Expenses',
      data: expenses,
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderRadius: 4,
      order: 2,
    },
    {
      label: 'Net Savings',
      data: netSavings,
      type: 'line' as const,
      borderColor: '#0d9488',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#0d9488',
      tension: 0.3,
      order: 1,
      yAxisID: 'y',
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
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
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (v) => `$${Number(v).toLocaleString()}`,
      },
    },
  },
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5">
    <div class="mb-4">
      <h3 class="font-display text-base font-bold text-brand-950">Income vs. Expenses</h3>
      <p class="text-xs text-gray-400">Last 6 months · teal line = net savings</p>
    </div>
    <Bar :data="chartData" :options="(chartOptions as any)" />

    <!-- Summary row -->
    <div class="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
      <div class="text-center">
        <p class="text-xs text-gray-400">Avg Income</p>
        <p class="text-sm font-bold text-brand-700">${{ Math.round(income.reduce((a,b)=>a+b,0)/income.length).toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-400">Avg Expenses</p>
        <p class="text-sm font-bold text-red-600">${{ Math.round(expenses.reduce((a,b)=>a+b,0)/expenses.length).toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-400">Avg Savings</p>
        <p class="text-sm font-bold text-teal-600">${{ Math.round(netSavings.reduce((a,b)=>a+b,0)/netSavings.length).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
