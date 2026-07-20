<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'
import FeatherIcon from '@/components/FeatherIcon.vue'

const { flightStatus, liveCountdown, journeyStatusText, boardingStatus, journeyProgressPercent } = useFlightState()

const launchTimeDisplay = computed(() => {
  const launchDate = new Date(flightStatus.launchTime)
  return launchDate.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
})

const topStatusItems = computed(() => [
  { 
    label: 'Flight Number', 
    value: flightStatus.flightNumber,
    icon: 'navigation'
  },
  { 
    label: 'Vehicle Name', 
    value: flightStatus.vehicleName,
    icon: 'send'
  },
  { 
    label: 'Destination', 
    value: flightStatus.destination,
    icon: 'globe'
  },
  { 
    label: 'Launch Time', 
    value: launchTimeDisplay.value,
    icon: 'clock'
  },
  { 
    label: 'Live Countdown', 
    value: liveCountdown.value,
    icon: 'watch'
  },
  { 
    label: 'Launch Window', 
    value: flightStatus.launchWindow,
    icon: 'x'
  },
])
</script>

<template>
  <section class="status-view">
    <h2>Operational Status</h2>
    <p class="summary">Routine departure profile. Launch remains on schedule.</p>

    <div class="status-grid">
      <div v-for="item in topStatusItems" :key="item.label" class="status-item-card">
        <div class="card-icon">
          <FeatherIcon :name="item.icon" size="32" color="#f7af43" />
        </div>
        <p class="item-label">{{ item.label }}</p>
        <p class="item-value">{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.status-view {
  padding: 28px 20px 24px;
}

h2 {
  margin: 0 0 6px;
  font-size: 1.48rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.summary {
  margin: 8px 0 20px;
  color: rgba(231, 231, 231, 0.72);
  font-size: 0.98rem;
  line-height: 1.5;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.status-item-card {
  background: rgba(26, 42, 74, 0.4);
  border: 1px solid rgba(241, 201, 138, 0.12);
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-item-card:hover {
  border-color: rgba(241, 201, 138, 0.3);
  background: rgba(26, 42, 74, 0.6);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-icon {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  border-radius: 50%;
  background: transparent;
  border: none;
  transition: all 0.3s ease;
}

.status-item-card:hover .card-icon {
  border-color: transparent;
  background: transparent;
}

.item-label {
  margin: 0 0 8px;
  font-size: 0.66rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.52);
  font-weight: 600;
}

.item-value {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 700;
  color: #e7e7e7;
  line-height: 1.4;
}
</style>
