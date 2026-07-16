<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'

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
    icon: 'mdi-airplane'
  },
  { 
    label: 'Vehicle Name', 
    value: flightStatus.vehicleName,
    icon: 'mdi-rocket-outline'
  },
  { 
    label: 'Destination', 
    value: flightStatus.destination,
    icon: 'mdi-earth'
  },
  { 
    label: 'Launch Time', 
    value: launchTimeDisplay.value,
    icon: 'mdi-clock-outline'
  },
  { 
    label: 'Live Countdown', 
    value: liveCountdown.value,
    icon: 'mdi-timer-outline'
  },
  { 
    label: 'Launch Window', 
    value: flightStatus.launchWindow,
    icon: 'mdi-window-closed'
  },
])
</script>

<template>
  <section class="status-view">
    <v-card class="status-card" rounded="xl" flat>
      <h2>Operational Status</h2>
      <p class="summary">Routine departure profile. Launch remains on schedule.</p>

      <div class="status-grid">
        <div v-for="item in topStatusItems" :key="item.label" class="status-item-card">
          <div class="card-icon">
            <v-icon :icon="item.icon" size="32" color="#F9C784" />
          </div>
          <p class="item-label">{{ item.label }}</p>
          <p class="item-value">{{ item.value }}</p>
        </div>
      </div>
    </v-card>
  </section>
</template>

<style scoped>
.status-view {
  padding-bottom: 18px;
}

.status-card {
  background: rgba(16, 25, 52, 0.9);
  border: 1px solid rgba(231, 231, 231, 0.12);
  color: #e7e7e7;
  padding: 20px 16px;
}

.status-card h2 {
  margin: 0;
  font-size: 1.4rem;
}

.summary {
  margin: 8px 0 18px;
  color: rgba(231, 231, 231, 0.76);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item-card {
  background: rgba(231, 231, 231, 0.08);
  border: 1px solid rgba(231, 231, 231, 0.14);
  border-radius: 8px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.2s ease;
}

.status-item-card:hover {
  border-color: rgba(249, 199, 132, 0.3);
}

.card-icon {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}

.item-label {
  margin: 0 0 6px;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.54);
  font-weight: 500;
}

.item-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e7e7e7;
  line-height: 1.3;
}
</style>
