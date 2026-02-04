<template>
  <div class="trend-chart">
    <svg viewBox="0 0 400 140" class="trend-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="50%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>
      </defs>

      <path :d="areaPath" fill="url(#trendGradient)" class="area-path" />
      <path :d="linePath" fill="transparent" stroke="url(#trendStroke)" stroke-width="3" class="line-path" />

      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="3.5" fill="var(--nav-bg)"
        stroke="url(#trendStroke)" stroke-width="2" class="data-point" />
    </svg>

    <div class="x-axis">
      <span v-for="label in labels" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // expected: [12, 19, 15, 25, 22, 30]
  },
  labels: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  }
})

const points = computed(() => {
  const max = Math.max(...props.data, 1)
  const width = 400
  const height = 140
  const padding = 18

  return props.data.map((val, i) => ({
    x: (i / (props.data.length - 1)) * (width - (padding * 2)) + padding,
    y: height - (val / max) * (height - (padding * 2)) - padding
  }))
})

const buildSmoothPath = (pts) => {
  if (pts.length < 2) return ''
  const smoothing = 0.2
  let d = `M ${pts[0].x},${pts[0].y}`

  for (let i = 0; i < pts.length - 1; i += 1) {
    const current = pts[i]
    const next = pts[i + 1]
    const prev = pts[i - 1] || current
    const nextNext = pts[i + 2] || next

    const controlPoint = (currentPoint, previousPoint, nextPoint, reverse = false) => {
      const dx = nextPoint.x - previousPoint.x
      const dy = nextPoint.y - previousPoint.y
      const angle = Math.atan2(dy, dx) + (reverse ? Math.PI : 0)
      const length = Math.hypot(dx, dy) * smoothing
      return {
        x: currentPoint.x + Math.cos(angle) * length,
        y: currentPoint.y + Math.sin(angle) * length
      }
    }

    const cps = controlPoint(current, prev, next)
    const cpe = controlPoint(next, current, nextNext, true)
    d += ` C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${next.x},${next.y}`
  }

  return d
}

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return buildSmoothPath(points.value)
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  const height = 140

  return `${linePath.value} L ${last.x},${height} L ${first.x},${height} Z`
})
</script>

<style scoped>
.trend-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.trend-svg {
  width: 100%;
  height: 140px;
  overflow: hidden;
  display: block;
}

.line-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease forwards;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 6px 12px rgba(99, 102, 241, 0.25));
}

.area-path {
  opacity: 0;
  animation: fadeIn 1s ease 1s forwards;
}

.data-point {
  animation: popIn 0.5s ease backwards;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 500;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
