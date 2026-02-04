<template>
    <BaseCard class="line-chart-card">
        <template #header>
            <div class="chart-header">
                <div class="section-title">
                    <i :class="['bi', icon]" aria-hidden="true"></i>
                    <span>{{ title }}</span>
                </div>
                <span v-if="subtitle" class="muted">{{ subtitle }}</span>
            </div>
        </template>

        <div v-if="isLoading" class="chart-loading">
            <div class="skeleton-line"></div>
        </div>

        <div v-else class="chart-container">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import { useThemeStore } from '@/stores/theme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: 'bi-activity',
    },
    labels: {
        type: Array,
        required: true,
    },
    series: {
        type: Array,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const themeStore = useThemeStore()

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: props.title,
            data: props.series,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.35,
            fill: true,
        },
    ],
}))

const chartOptions = computed(() => {
    const isDark = themeStore.isDarkMode
    const textColor = isDark ? 'rgba(248, 248, 252, 0.8)' : 'rgba(3, 3, 7, 0.6)'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                titleColor: isDark ? '#f8f8fc' : '#030307',
                bodyColor: isDark ? '#f8f8fc' : '#030307',
                padding: 12,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: textColor, font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: gridColor, drawBorder: false },
                ticks: { color: textColor, font: { size: 11 } },
            },
        },
    }
})
</script>

<style scoped>
.line-chart-card {
    min-height: 300px;
    display: flex;
    flex-direction: column;
}

.chart-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 16px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
}

.muted {
    color: var(--color-muted);
    font-size: 14px;
}

.chart-container {
    flex-grow: 1;
    height: 220px;
    position: relative;
}

.chart-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
}

.skeleton-line {
    width: 100%;
    height: 140px;
    border-radius: 12px;
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
}
</style>
