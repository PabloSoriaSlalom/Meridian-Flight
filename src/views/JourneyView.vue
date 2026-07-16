<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'
import welcomeLogo from '@/images/MS_logo.png'

const {
  routeStages,
  routeStageIndex,
  activeStage,
  isProcessing,
  processingSteps,
  activeProcessingIndex,
  liveCountdown,
  advanceJourney,
} = useFlightState()

const isWelcome = computed(() => activeStage.value.kind === 'welcome')
const isLounge = computed(() => activeStage.value.id === 4)
const isOnboard = computed(() => activeStage.value.id === 5)

const dominantHeading = computed(() => {
  if (isOnboard.value) {
    return liveCountdown.value
  }

  if (isLounge.value) {
    return activeStage.value.primaryInfo ?? ''
  }

  return activeStage.value.destination
})

const dominantLabel = computed(() => {
  if (isOnboard.value) {
    return 'Live launch countdown'
  }

  return activeStage.value.destinationLabel
})

const completedProcessingIndex = computed(() => activeProcessingIndex.value - 1)
</script>

<template>
  <section :class="['journey-view', { 'journey-view--welcome': isWelcome }]">
    <div v-if="!isWelcome" class="route-wrap" aria-label="Journey route progress">
      <ol class="route-line">
        <li
          v-for="(stage, index) in routeStages"
          :key="stage.id"
          :class="[
            'route-stop',
            {
              completed: index < routeStageIndex,
              current: index === routeStageIndex,
              future: index > routeStageIndex,
            },
          ]"
        >
          <span class="stop-dot">
            <v-icon v-if="index < routeStageIndex" size="13">mdi-check</v-icon>
          </span>
          <span class="stop-label">{{ stage.routeLabel }}</span>
          <span v-if="index < routeStages.length - 1" class="stop-link"></span>
        </li>
      </ol>
    </div>

    <section :class="['stage-panel', { 'stage-panel--welcome': isWelcome }]">
      <div v-if="!isWelcome" class="icon-wrap">
        <v-icon :icon="activeStage.icon" size="54" color="#F9C784" />
      </div>

      <template v-if="isWelcome">
        <div class="welcome-hero">
          <div class="welcome-content">
            <img :src="welcomeLogo" alt="Meridian Flight" class="welcome-logo" />
            <p class="where-lead">{{ activeStage.locationLead }}</p>
            <h2 class="where-name">{{ activeStage.location }}</h2>
            <p class="welcome-flight-meta">{{ activeStage.supportingDetail }}</p>
            <p class="welcome-status">Your flight is on schedule.</p>
            <p class="instruction">{{ activeStage.instruction }}</p>

            <v-btn
              block
              size="x-large"
              rounded="xl"
              class="action-btn action-btn--welcome"
              @click="advanceJourney"
            >
              {{ activeStage.actionLabel }}
            </v-btn>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="where-lead">{{ activeStage.locationLead }}</p>
        <h2 class="where-name">{{ activeStage.location }}</h2>

        <p v-if="activeStage.completionMessage" class="completion-message">{{ activeStage.completionMessage }}</p>

        <p v-if="dominantLabel" class="next-label">{{ dominantLabel }}</p>
        <h3 :class="['dominant', { countdown: isOnboard }]">{{ dominantHeading }}</h3>

        <p class="instruction">{{ activeStage.instruction }}</p>
        <p v-if="activeStage.supportingDetail" class="supporting">{{ activeStage.supportingDetail }}</p>

        <div v-if="activeStage.requiredItems?.length" class="required-items" aria-label="Required items">
          <p class="next-label">Required items</p>
          <div class="item-row">
            <span v-for="item in activeStage.requiredItems" :key="item" class="item-chip">{{ item }}</span>
          </div>
        </div>

        <div v-if="isOnboard" class="onboard-meta">
          <div>
            <p class="meta-label">Flight</p>
            <p class="meta-value">Meridian Flight M102</p>
          </div>
          <div>
            <p class="meta-label">Seat</p>
            <p class="meta-value">14A</p>
          </div>
        </div>
      </template>

      <v-expand-transition>
        <div v-if="isProcessing" class="processing-checklist">
          <div
            v-for="(step, index) in processingSteps"
            :key="step"
            :class="[
              'check-row',
              {
                done: index <= completedProcessingIndex,
                active: index === activeProcessingIndex,
              },
            ]"
          >
            <span class="check-symbol">
              {{ index <= completedProcessingIndex ? '✓' : index === activeProcessingIndex ? '●' : '○' }}
            </span>
            <p>{{ step }}</p>
          </div>
        </div>
      </v-expand-transition>
    </section>

    <v-btn
      v-if="activeStage.actionLabel && !isWelcome"
      block
      size="x-large"
      rounded="xl"
      class="action-btn"
      :loading="isProcessing"
      :disabled="isProcessing"
      @click="advanceJourney"
    >
      {{ activeStage.actionLabel }}
    </v-btn>
  </section>
</template>

<style scoped>
.journey-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 18px;
}

.journey-view--welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  min-height: 0;
  padding-bottom: 0;
}

.route-wrap {
  overflow-x: auto;
  padding-bottom: 2px;
}

.route-line {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(66px, 1fr));
  align-items: start;
}

.route-stop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stop-dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid rgba(231, 231, 231, 0.25);
  background: rgba(72, 86, 150, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9c784;
  z-index: 1;
}

.stop-label {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.56);
}

.stop-link {
  position: absolute;
  top: 11px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(231, 231, 231, 0.2);
}

.route-stop.completed .stop-dot {
  background: rgba(249, 199, 132, 0.22);
  border-color: rgba(249, 199, 132, 0.75);
}

.route-stop.current .stop-dot {
  background: #f9c784;
  border-color: #f9c784;
  box-shadow: 0 0 0 3px rgba(249, 199, 132, 0.2);
}

.route-stop.current .stop-label {
  color: rgba(249, 199, 132, 0.92);
  font-weight: 700;
}

.route-stop.future .stop-dot {
  opacity: 0.5;
}

.route-stop.completed .stop-link {
  background: rgba(249, 199, 132, 0.7);
}

.stage-panel {
  background: rgba(16, 25, 52, 0.9);
  border: 1px solid rgba(231, 231, 231, 0.12);
  border-radius: 22px;
  padding: 20px 18px;
  color: #e7e7e7;
}

.stage-panel--welcome {
  flex: 0 1 auto;
  height: auto;
  min-height: 0;
  border-radius: 0;
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: stretch;
}

.welcome-hero {
  position: relative;
  flex: 0 1 auto;
  height: 100%;
  min-height: 100%;
  background: transparent;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  position: relative;
  z-index: 1;
  width: min(360px, calc(100% - 48px));
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(72, 86, 150, 0.45);
  border: 1px solid rgba(249, 199, 132, 0.26);
  margin-bottom: 14px;
}

.welcome-logo {
  width: min(210px, 74%);
  height: auto;
  margin: 0 0 6px;
  border-radius: 6px;
}

.where-lead {
  margin: 0;
  font-size: 1.06rem;
  color: rgba(231, 231, 231, 0.95);
}

.where-name {
  margin: -4px 0 2px;
  font-size: 2rem;
  line-height: 1.08;
  color: #ffffff;
}

.welcome-status {
  margin: 2px 0 0;
  color: #f9c784;
  font-size: 1.08rem;
}

.welcome-flight-meta {
  margin: -6px 0 0;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  color: rgba(138, 213, 255, 0.95);
}

.next-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.62);
}

.dominant {
  margin: 6px 0 10px;
  font-size: 2rem;
  line-height: 1.05;
  color: #f9c784;
}

.countdown {
  font-size: 2.45rem;
  letter-spacing: 0.05em;
}

.completion-message {
  margin: 0 0 10px;
  color: rgba(249, 199, 132, 0.98);
  font-size: 0.9rem;
  letter-spacing: 0.03em;
}

.instruction {
  margin: 2px 0 0;
  font-size: 1.02rem;
  line-height: 1.42;
  max-width: 29ch;
  color: rgba(231, 231, 231, 0.9);
}

.supporting {
  margin: 2px 0 0;
  max-width: 32ch;
  line-height: 1.38;
  color: rgba(231, 231, 231, 0.78);
}

.required-items {
  margin-top: 12px;
}

.item-row {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-chip {
  border: 1px solid rgba(231, 231, 231, 0.3);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.82rem;
  color: rgba(231, 231, 231, 0.94);
}

.onboard-meta {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.meta-label {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.6);
}

.meta-value {
  margin: 4px 0 0;
  color: rgba(231, 231, 231, 0.95);
}

.processing-checklist {
  margin-top: 14px;
  border-top: 1px solid rgba(231, 231, 231, 0.12);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.55;
  transition: opacity 0.25s ease;
}

.check-row.done,
.check-row.active {
  opacity: 1;
}

.check-symbol {
  width: 16px;
  text-align: center;
  color: #f9c784;
  font-size: 0.95rem;
}

.check-row p {
  margin: 0;
  font-size: 0.92rem;
  color: rgba(231, 231, 231, 0.9);
}

.action-btn {
  background: linear-gradient(90deg, #fc7a1e, #f24c00);
  color: #091022;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.action-btn--welcome {
  margin-top: 14px;
  width: 100%;
  max-width: 320px;
  transform: none !important;
}

.action-btn--welcome:hover,
.action-btn--welcome:focus,
.action-btn--welcome:active {
  transform: none !important;
}

@media (max-width: 360px) {
  .route-line {
    min-width: 360px;
  }
}
</style>
