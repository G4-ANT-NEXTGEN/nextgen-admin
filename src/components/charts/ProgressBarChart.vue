<template>
  <BaseCard class="progress-chart-card">
    <template #header>
      <div class="chart-header">
        <div class="section-title">
          <i :class="['bi', icon]" aria-hidden="true"></i>
          <span>{{ title }}</span>
        </div>
      </div>
    </template>

    <div v-if="isLoading" class="chart-loading skeleton-progress-list">
      <div v-for="i in 4" :key="i" class="skeleton-progress-row">
        <div class="skeleton-progress-top">
          <BaseSkeleton width="40%" height="14px" />
          <BaseSkeleton width="15%" height="14px" />
        </div>
        <BaseSkeleton width="100%" height="8px" borderRadius="999px" />
      </div>
    </div>

    <div v-else-if="!data || data.length === 0" class="chart-empty">
      <p>No data available</p>
    </div>

    <div v-else class="progress-container">
      <div class="chart-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <div v-if="summary" class="summary-row">
        <div v-for="(value, key) in summary" :key="key" class="summary-card">
          <span class="summary-value">{{ value }}</span>
          <span class="summary-label">{{ formatLabel(key) }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'bi-speedometer2',
  },
  data: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every((item) => item.label && typeof item.value === 'number'),
  },
  summary: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const chartData = computed(() => {
  const isDark = themeStore.isDarkMode
  const barColor = isDark ? 'rgba(241, 245, 249, 0.9)' : 'rgba(59, 130, 246, 0.8)'
  const borderColor = isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(59, 130, 246, 1)'

  return {
    labels: props.data.map(item => item.label),
    datasets: [
      {
        label: 'Progress',
        data: props.data.map(item => item.value),
        backgroundColor: barColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20,
      }
    ]
  }
})

const chartOptions = computed(() => {
  const isDark = themeStore.isDarkMode
  const textColor = isDark ? 'rgba(248, 248, 252, 0.8)' : 'rgba(3, 3, 7, 0.7)'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
        titleColor: isDark ? '#f8f8fc' : '#030307',
        bodyColor: isDark ? '#f8f8fc' : '#030307',
        padding: 12,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return context.parsed.x + '%'
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: gridColor,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          },
          callback: function (value) {
            return value + '%'
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 500
          }
        }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    }
  }
})

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
</script>

<style scoped>
.progress-chart-card {
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-text);
}

.muted {
  color: var(--color-muted);
  font-size: 12px;
}

.chart-loading,
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: var(--color-muted);
}

.skeleton-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
}

.skeleton-progress-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-progress-top {
  display: flex;
  justify-content: space-between;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.chart-wrapper {
  height: 180px;
  position: relative;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.summary-card {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: grid;
  gap: 4px;
  background: var(--nav-bg);
}

.summary-value {
  font-weight: 700;
  color: var(--color-text);
}

.summary-label {
  color: var(--color-muted);
  font-size: 12px;
}
</style>
