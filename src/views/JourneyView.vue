<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'

const {
  stages,
  activeStage,
  completedStageCount,
  journeyProgressPercent,
  isProcessing,
  processingMessage,
  liveCountdown,
  advanceJourney,
} = useFlightState()

const progressLabel = computed(() => `Stage ${activeStage.value.id} of ${stages.length}`)
</script>

<template>
  <section class="journey-view">
    <div class="progress-wrap">
      <div class="progress-head">
        <p class="progress-stage">{{ progressLabel }}</p>
        <p class="progress-percent">{{ journeyProgressPercent }}%</p>
      </div>
      <v-progress-linear
        :model-value="journeyProgressPercent"
        color="#F9C784"
        bg-color="rgba(231, 231, 231, 0.15)"
        rounded
        height="10"
      />
    </div>

    <v-card class="stage-card" rounded="xl" flat>
      <div class="icon-wrap">
        <v-icon :icon="activeStage.icon" size="54" color="#F9C784" />
      </div>

      <p class="stage-label">{{ activeStage.label }}</p>
      <h2 class="stage-title">{{ activeStage.headline }}</h2>
      <p class="stage-instruction">{{ activeStage.instruction }}</p>

      <v-list v-if="activeStage.info.length > 0" class="info-list" density="comfortable" bg-color="transparent">
        <v-list-item v-for="item in activeStage.info" :key="item" class="info-item">
          <template #prepend>
            <v-icon size="18" color="#FC7A1E">mdi-circle-medium</v-icon>
          </template>
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <div v-if="activeStage.id === 5" class="onboard-details">
        <p><strong>Seat:</strong> 14A</p>
        <p><strong>Live Countdown:</strong> {{ liveCountdown }}</p>
        <p><strong>Departure:</strong> Launch remains on schedule.</p>
      </div>

      <v-expand-transition>
        <div v-if="isProcessing" class="processing-panel">
          <v-progress-circular indeterminate color="#F9C784" :size="22" :width="3" />
          <p>{{ processingMessage }}</p>
        </div>
      </v-expand-transition>
    </v-card>

    <v-btn
      v-if="activeStage.id < 5"
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

    <p class="stage-footnote">
      Completed stages: {{ completedStageCount }} / {{ stages.length - 1 }}
    </p>
  </section>
</template>

<style scoped>
.journey-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 18px;
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.progress-stage,
.progress-percent {
  margin: 0;
  color: rgba(231, 231, 231, 0.86);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

.stage-card {
  background: rgba(16, 25, 52, 0.9);
  border: 1px solid rgba(231, 231, 231, 0.12);
  padding: 22px 18px;
  color: #e7e7e7;
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
  margin-bottom: 16px;
}

.stage-label {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.72);
}

.stage-title {
  margin: 8px 0 8px;
  font-size: 1.55rem;
  line-height: 1.18;
}

.stage-instruction {
  margin: 0;
  font-size: 1rem;
  color: rgba(231, 231, 231, 0.86);
}

.info-list {
  margin-top: 14px;
  padding: 0;
}

.info-item :deep(.v-list-item-title) {
  color: rgba(231, 231, 231, 0.88);
  font-size: 0.96rem;
}

.processing-panel {
  margin-top: 18px;
  border-top: 1px solid rgba(231, 231, 231, 0.12);
  padding-top: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.processing-panel p {
  margin: 0;
  font-size: 0.92rem;
  color: rgba(249, 199, 132, 0.96);
}

.action-btn {
  background: linear-gradient(90deg, #fc7a1e, #f24c00);
  color: #091022;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.onboard-details {
  margin-top: 16px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(72, 86, 150, 0.3);
  border: 1px solid rgba(231, 231, 231, 0.15);
}

.onboard-details p {
  margin: 0;
  color: rgba(231, 231, 231, 0.92);
}

.onboard-details p + p {
  margin-top: 8px;
}

.stage-footnote {
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(231, 231, 231, 0.62);
}
</style>
