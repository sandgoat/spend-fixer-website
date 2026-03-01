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

type View = 'daily' | 'weekly' | 'monthly'
const view = ref<View>('daily')

// Mock daily spending for March (31 days)
const dailyRaw = [
  42, 0, 118, 67, 23, 0, 189, 55, 34, 0, 78, 145, 29, 88, 0, 210, 44, 67, 0, 95, 33, 140, 72, 0, 48, 88, 0, 155, 39, 62, 25,
]

const dailyLabels = dailyRaw.map((_, i) => `Mar ${i + 1}`)

const weeklyData = [0, 1, 2, 3].map((w) => {
  const slice = dailyRaw.slice(w * 7, w * 7 + 7)
  return slice.reduce((a, b) => a + b, 0)
})
const weeklyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const monthlyData = [1660, 1920, 2100, 1840, 2380, 1660]
const monthlyLabels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const rollingAvg = (data: number[], window = 7) =>
  data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })

const chartData = computed(() => {
  let labels: string[]
  let vals: number[]

  if (view.value === 'daily') {
    labels = dailyLabels
    vals = dailyRaw
  } else if (view.value === 'weekly') {
    labels = weeklyLabels
    vals = weeklyData
  } else {
    labels = monthlyLabels
    vals = monthlyData
  }

  const avg = rollingAvg(vals, view.value === 'daily' ? 7 : 2)

  return {
    labels,
    datasets: [
      {
        label: 'Spending',
        data: vals,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.08)',
        borderWidth: 2,
        pointRadius: view.value === 'daily' ? 2 : 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Rolling Avg',
        data: avg,
        borderColor: '#14b8a6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  }
})

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
        label: (ctx) => ` $${Number(ctx.parsed.y).toFixed(2)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 }, maxRotation: 0 },
    },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (v) => `$${v}`,
      },
    },
  },
}

const views: { key: View; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="font-display text-base font-bold text-brand-950">Spending Over Time</h3>
        <p class="text-xs text-gray-400">With 7-day rolling average</p>
      </div>
      <div class="flex gap-1 rounded-lg border border-gray-200 p-0.5">
        <button
          v-for="v in views"
          :key="v.key"
          class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
          :class="view === v.key ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          @click="view = v.key"
        >
          {{ v.label }}
        </button>
      </div>
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
