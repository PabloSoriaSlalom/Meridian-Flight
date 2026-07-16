<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'

const { flightStatus, liveCountdown } = useFlightState()

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
</script>

<template>
  <section class="pass-view">
    <v-card class="pass-card" rounded="xl" flat>
      <p class="pass-kicker">Passenger Credential</p>
      <h2>Meridian Boarding Pass</h2>

      <div class="identity-row">
        <div>
          <p class="label">Flight</p>
          <p class="value">{{ flightStatus.flightNumber }}</p>
        </div>
        <div>
          <p class="label">Seat</p>
          <p class="value">14A</p>
        </div>
      </div>

      <div class="identity-row">
        <div>
          <p class="label">Vehicle</p>
          <p class="value">{{ flightStatus.vehicleName }}</p>
        </div>
        <div>
          <p class="label">Destination</p>
          <p class="value">{{ flightStatus.destination }}</p>
        </div>
      </div>

      <div class="identity-row">
        <div>
          <p class="label">Launch Time</p>
          <p class="value">{{ launchTimeDisplay }}</p>
        </div>
        <div>
          <p class="label">Countdown</p>
          <p class="value">{{ liveCountdown }}</p>
        </div>
      </div>

      <div class="qr-block" aria-label="QR Code placeholder"></div>

      <div class="docs-row">
        <p class="label">Required Documents</p>
        <p class="value">Government ID and Boarding Credential</p>
      </div>
    </v-card>
  </section>
</template>

<style scoped>
.pass-view {
  padding-bottom: 18px;
}

.pass-card {
  background: rgba(16, 25, 52, 0.9);
  border: 1px solid rgba(231, 231, 231, 0.12);
  color: #e7e7e7;
  padding: 20px 16px;
}

.pass-kicker {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.58);
}

.pass-card h2 {
  margin: 8px 0 18px;
  font-size: 1.42rem;
}

.identity-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(231, 231, 231, 0.1);
}

.label {
  margin: 0;
  font-size: 0.76rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.6);
}

.value {
  margin: 4px 0 0;
  color: rgba(231, 231, 231, 0.94);
}

.qr-block {
  margin: 16px auto;
  width: 170px;
  height: 170px;
  border-radius: 8px;
  border: 8px solid #e7e7e7;
  background-image:
    linear-gradient(90deg, #111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%),
    linear-gradient(#111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
  background-color: #f4f4f4;
}

.docs-row {
  margin-top: 8px;
}
</style>
