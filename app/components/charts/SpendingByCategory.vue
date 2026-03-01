<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const emit = defineEmits<{
  (e: 'filter-category', category: string | null): void
}>()

const props = defineProps<{
  data?: Record<string, number>
}>()

const mockData: Record<string, number> = {
  Food: 420,
  Transport: 180,
  Entertainment: 95,
  Shopping: 310,
  Bills: 580,
  Health: 75,
}

const spending = computed(() => props.data ?? mockData)

const palette = [
  '#059669', // emerald-600
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#0d9488', // teal-600
  '#14b8a6', // teal-500
  '#5eead4', // teal-300
]

const total = computed(() => Object.values(spending.value).reduce((a, b) => a + b, 0))

const labels = computed(() => Object.keys(spending.value))
const values = computed(() => Object.values(spending.value))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      data: values.value,
      backgroundColor: palette,
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 6,
    },
  ],
}))

const selectedCategory = ref<string | null>(null)

const chartOptions: ChartOptions<'doughnut'> = {
  cutout: '65%',
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` $${ctx.parsed.toFixed(2)} (${((ctx.parsed / total.value) * 100).toFixed(1)}%)`,
      },
    },
  },
  onClick: (_event, elements) => {
    if (elements.length === 0) {
      selectedCategory.value = null
      emit('filter-category', null)
      return
    }
    const idx = elements[0].index
    const cat = labels.value[idx]
    selectedCategory.value = selectedCategory.value === cat ? null : cat
    emit('filter-category', selectedCategory.value)
  },
}

const percent = (val: number) => ((val / total.value) * 100).toFixed(1)
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5">
    <h3 class="font-display text-base font-bold text-brand-950">Spending by Category</h3>
    <p class="mb-4 text-xs text-gray-400">Current month · click a slice to filter</p>

    <div class="mx-auto w-48">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <!-- Legend -->
    <ul class="mt-5 space-y-2">
      <li
        v-for="(cat, idx) in labels"
        :key="cat"
        class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-gray-50"
        :class="{ 'bg-brand-50 ring-1 ring-brand-200': selectedCategory === cat }"
        @click="() => { selectedCategory = selectedCategory === cat ? null : cat; emit('filter-category', selectedCategory) }"
      >
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 shrink-0 rounded-full" :style="{ backgroundColor: palette[idx] }" />
          <span class="text-sm font-medium text-gray-700">{{ cat }}</span>
        </div>
        <div class="text-right">
          <span class="text-sm font-semibold text-gray-900">${{ values[idx].toFixed(2) }}</span>
          <span class="ml-2 text-xs text-gray-400">{{ percent(values[idx]) }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>
