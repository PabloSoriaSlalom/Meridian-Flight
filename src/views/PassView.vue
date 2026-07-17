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
  padding-bottom: 24px;
}

.pass-card {
  background: linear-gradient(135deg, rgba(10, 15, 27, 0.98), rgba(26, 42, 74, 0.95));
  border: 1px solid rgba(241, 201, 138, 0.15);
  color: #e7e7e7;
  padding: 36px 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.pass-kicker {
  margin: 0 0 4px;
  font-size: 0.66rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.54);
  font-weight: 600;
}

.pass-card h2 {
  margin: 8px 0 22px;
  font-size: 1.48rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.identity-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(231, 231, 231, 0.08);
}

.label {
  margin: 0 0 2px;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.58);
  font-weight: 600;
}

.value {
  margin: 0;
  color: rgba(231, 231, 231, 0.94);
  font-weight: 600;
}

.qr-block {
  margin: 20px auto;
  width: 160px;
  height: 160px;
  border-radius: 8px;
  border: 8px solid #e7e7e7;
  background-image:
    linear-gradient(90deg, #111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%),
    linear-gradient(#111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
  background-color: #f4f4f4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.docs-row {
  margin-top: 12px;
}
</style>
