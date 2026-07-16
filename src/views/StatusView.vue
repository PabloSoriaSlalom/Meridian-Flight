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

const statusRows = computed(() => [
  { label: 'Flight Number', value: flightStatus.flightNumber },
  { label: 'Vehicle Name', value: flightStatus.vehicleName },
  { label: 'Destination', value: flightStatus.destination },
  { label: 'Launch Time', value: launchTimeDisplay.value },
  { label: 'Live Countdown', value: liveCountdown.value },
  { label: 'Launch Window', value: flightStatus.launchWindow },
  { label: 'Vehicle Turnaround', value: flightStatus.vehicleTurnaroundStatus },
  { label: 'Cabin Preparation', value: flightStatus.cabinPreparation },
  { label: 'Fueling Status', value: flightStatus.fuelingStatus },
  { label: 'Final Inspection', value: flightStatus.finalInspection },
  { label: 'Weather', value: flightStatus.weather },
  { label: 'Boarding Status', value: boardingStatus.value },
  { label: 'Journey Progress', value: `${journeyProgressPercent.value}%` },
  { label: 'Current Journey State', value: journeyStatusText.value },
])
</script>

<template>
  <section class="status-view">
    <v-card class="status-card" rounded="xl" flat>
      <h2>Operational Status</h2>
      <p class="summary">Routine departure profile. Launch remains on schedule.</p>

      <div class="status-grid">
        <div v-for="row in statusRows" :key="row.label" class="status-row">
          <p class="label">{{ row.label }}</p>
          <p class="value">{{ row.value }}</p>
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-row {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(231, 231, 231, 0.1);
}

.status-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.label {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.58);
}

.value {
  margin: 6px 0 0;
  font-size: 1rem;
  color: rgba(231, 231, 231, 0.92);
}
</style>
