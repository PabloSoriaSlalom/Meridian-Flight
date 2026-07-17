<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useFlightState } from '@/composables/useFlightState'
import FeatherIcon from '@/components/FeatherIcon.vue'
import meridianLogo from '@/images/MS_logo.png'
import heroImage from '@/images/hero2.jpg'

const route = useRoute()
const router = useRouter()
const { activeStage, passengerFirstName, setPassengerFirstName, resetJourney } = useFlightState()
const nameInput = ref('')

const activeTab = computed({
  get: () => String(route.name ?? 'journey'),
  set: (name: string) => {
    if (String(route.name) !== name) {
      router.push({ name })
    }
  },
})

const isWelcomeJourneyView = computed(() => route.name === 'journey' && activeStage.value.kind === 'welcome')
const needsPersonalization = computed(() => passengerFirstName.value.trim().length === 0)
const canContinue = computed(() => nameInput.value.trim().length > 0)

function continueWithName() {
  if (!setPassengerFirstName(nameInput.value)) {
    return
  }

  nameInput.value = ''
  router.push({ name: 'journey' })
}
</script>

<template>
  <v-app>
    <div :class="['meridian-bg', { 'meridian-bg--welcome': isWelcomeJourneyView }]">
      <div v-if="!isWelcomeJourneyView" class="glow glow-a"></div>
      <div v-if="!isWelcomeJourneyView" class="glow glow-b"></div>

      <main class="review-frame">
        <div class="review-stack">
          <section :class="['phone-shell', { 'phone-shell--welcome': isWelcomeJourneyView }]">
            <header v-if="!isWelcomeJourneyView" class="shell-header">
              <img :src="meridianLogo" alt="Meridian Space" class="shell-logo" />
            </header>

            <section
              v-if="needsPersonalization"
              class="shell-content shell-content--personalize"
              aria-label="Personalize experience"
            >
              <div class="personalize-card">
                <p class="personalize-copy">
                  Enter your name and continue.
                </p>
                <v-text-field
                  v-model="nameInput"
                  label="First name"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details
                  class="personalize-input"
                  @keydown.enter="continueWithName"
                />
                <v-btn
                  block
                  size="large"
                  rounded="lg"
                  class="personalize-btn"
                  :disabled="!canContinue"
                  @click="continueWithName"
                >
                  Continue
                </v-btn>
              </div>
            </section>

            <section v-else :class="['shell-content', { 'shell-content--welcome': isWelcomeJourneyView }]" :style="isWelcomeJourneyView ? { backgroundImage: `url(${heroImage})` } : {}">
              <RouterView />
            </section>

            <v-bottom-navigation
              v-if="!isWelcomeJourneyView"
              v-model="activeTab"
              grow
              class="shell-nav"
              bg-color="transparent"
              density="comfortable"
            >
              <v-btn value="journey">
                <FeatherIcon name="map-pin" size="20" />
                <span>Journey</span>
              </v-btn>
              <v-btn value="status">
                <FeatherIcon name="wifi" size="20" />
                <span>Status</span>
              </v-btn>
              <v-btn value="pass">
                <FeatherIcon name="tag" size="20" />
                <span>Pass</span>
              </v-btn>
            </v-bottom-navigation>
          </section>

          <div v-if="!isWelcomeJourneyView" class="review-controls">
            <v-btn
              variant="text"
              size="small"
              rounded="xl"
              class="reset-btn"
              @click="resetJourney"
            >
              <FeatherIcon name="rotate-ccw" size="16" />
              <span>Reset Experience</span>
            </v-btn>
          </div>
        </div>
      </main>
    </div>
  </v-app>
</template>

<style scoped>
.meridian-bg {
  position: relative;
  min-height: 100vh;
  padding: 16px;
  background: radial-gradient(120% 120% at 20% 0%, #485696 0%, #12182e 48%, #0a0e1f 100%);
  overflow: hidden;
}

.meridian-bg--welcome {
  background: #0a1024;
}

.glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.2;
  pointer-events: none;
}

.glow-a {
  width: 220px;
  height: 220px;
  background: #f1c98a;
  top: -80px;
  right: -70px;
}

.glow-b {
  width: 260px;
  height: 260px;
  background: #fc7a1e;
  bottom: -120px;
  left: -120px;
}

.review-frame {
  position: relative;
  margin: 0 auto;
  min-height: calc(100vh - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-stack {
  width: 100%;
  max-width: 420px;
}

.phone-shell {
  width: 100%;
  min-height: calc(100vh - 32px);
  border-radius: 28px;
  border: 1px solid rgba(231, 231, 231, 0.18);
  background: linear-gradient(180deg, rgba(9, 15, 34, 0.9) 0%, rgba(12, 20, 45, 0.96) 100%);
  box-shadow: 0 24px 48px rgba(2, 7, 24, 0.55);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.phone-shell--welcome {
  background: transparent;
}

.shell-header {
  padding: 14px 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid rgba(231, 231, 231, 0.14);
  background: linear-gradient(180deg, rgba(12, 20, 45, 0.82) 0%, rgba(10, 16, 36, 0.72) 100%);
}

.shell-logo {
  width: 148px;
  max-width: 52%;
  height: auto;
  border-radius: 6px;
}

.flight-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.flight-number {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.8);
}

.flight-status {
  margin: 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #77e0b5;
  background: rgba(119, 224, 181, 0.16);
  border: 1px solid rgba(119, 224, 181, 0.5);
}

.shell-content {
  flex: 1;
  padding: 14px 16px 0;
  overflow-y: auto;
}

.shell-content--welcome {
  flex: 1;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: auto auto;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--welcome::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 0;
}

.shell-content--welcome > * {
  position: relative;
  z-index: 1;
}

.shell-content--personalize {
  padding: 24px 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.personalize-card {
  width: min(340px, 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.personalize-copy {
  margin: 2px 0 6px;
  color: rgba(231, 231, 231, 0.82);
  line-height: 1.35;
  font-size: 0.98rem;
}

.personalize-input {
  width: 100%;
}

.personalize-input :deep(.v-field) {
  --v-field-padding-start: 14px;
  --v-field-padding-end: 14px;
  min-height: 52px;
}

.personalize-input :deep(.v-field__input) {
  padding-inline: 14px !important;
}

.personalize-input :deep(.v-label.v-field-label) {
  left: 14px !important;
}

.personalize-btn {
  width: 100%;
  min-height: 52px;
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 86, 147, 0.3);
}

.personalize-btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px rgba(74, 86, 147, 0.5);
  transform: translateY(-2px);
}

.shell-content--welcome :deep(.journey-view--welcome) {
  flex: 1;
  min-height: 100%;
}

.shell-nav {
  border-top: 1px solid rgba(231, 231, 231, 0.14);
  background: rgba(9, 15, 34, 0.75) !important;
}

.review-controls {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.reset-btn {
  color: rgba(231, 231, 231, 0.62);
  opacity: 0.8;
  letter-spacing: 0.03em;
}

@media (min-width: 768px) {
  .meridian-bg {
    padding: 28px;
  }

  .review-frame {
    min-height: calc(100vh - 56px);
  }

  .phone-shell {
    min-height: 780px;
    max-height: calc(100vh - 56px);
  }

  .phone-shell--welcome {
    max-height: calc(100vh - 56px);
  }

  .review-controls {
    padding-top: 14px;
  }
}
</style>
