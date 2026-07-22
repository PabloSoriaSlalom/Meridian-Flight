<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useFlightState } from '@/composables/useFlightState'
import FeatherIcon from '@/components/FeatherIcon.vue'
import ResetButton from '@/components/ResetButton.vue'
import meridianLogo from '@/images/MS_logo.png'
import heroImage from '@/images/hero2.jpg'
import lobbyBgImage from '@/images/lobby_bg.jpg'
import checkinBgImage from '@/images/checkin_bg.jpg'
import securityBgImage from '@/images/security_bg.jpg'
import loungeBgImage from '@/images/lounge_bg.jpg'
import boardingBgImage from '@/images/boarding_bg.jpg'
import onboardBgImage from '@/images/onboard_bg.jpg'

const route = useRoute()
const router = useRouter()
const { activeStage, passengerFirstName, setPassengerFirstName, resetJourney, journeyState, checkInComplete, securityComplete, boardingPassGenerated } = useFlightState()
const nameInput = ref('')

const isWelcomeJourneyView = computed(() => route.name === 'journey' && activeStage.value.kind === 'welcome')
const isLobbyCircleView = computed(() => route.name === 'journey' && journeyState.value === 'lobbyCircle')
const isCheckInReadyView = computed(() => route.name === 'journey' && journeyState.value === 'checkInReady')
const isSynchronizingLobbyView = computed(() => route.name === 'journey' && journeyState.value === 'synchronizingLobby')
const isLobbyLikeView = computed(() => isLobbyCircleView.value || isCheckInReadyView.value || isSynchronizingLobbyView.value)
const isLobbyBgImageView = computed(() => isLobbyCircleView.value || isCheckInReadyView.value)
const isCheckInProcessingView = computed(() => route.name === 'journey' && journeyState.value === 'checkInProcessing')
const isCheckInInsideCircleView = computed(() => route.name === 'journey' && journeyState.value === 'checkInCircle')
const isSynchronizingCheckInView = computed(() => route.name === 'journey' && journeyState.value === 'synchronizingCheckIn')
const isCheckInBackgroundView = computed(() => (isCheckInProcessingView.value || isCheckInInsideCircleView.value) && !checkInComplete.value)
const isCheckInBgPaddingView = computed(() => isCheckInProcessingView.value || isCheckInInsideCircleView.value || isSynchronizingCheckInView.value)
const isSecurityProcessingView = computed(() => route.name === 'journey' && journeyState.value === 'securityProcessing')
const isSecurityInsideCircleView = computed(() => route.name === 'journey' && journeyState.value === 'securityCircle')
const isSynchronizingSecurityView = computed(() => route.name === 'journey' && journeyState.value === 'synchronizingSecurity')
const isSecurityBackgroundView = computed(() => (isSecurityProcessingView.value || isSecurityInsideCircleView.value) && !securityComplete.value)
const isSecurityBgPaddingView = computed(() => isSecurityProcessingView.value || isSecurityInsideCircleView.value || isSynchronizingSecurityView.value)
const isLoungeCircleView = computed(() => route.name === 'journey' && journeyState.value === 'loungeCircle')
const isNowBoardingView = computed(() => route.name === 'journey' && journeyState.value === 'nowBoarding')
const isSynchronizingLoungeView = computed(() => route.name === 'journey' && journeyState.value === 'synchronizingLounge')
const isLoungeBgPaddingView = computed(() => isLoungeCircleView.value || isSynchronizingLoungeView.value)
const isBoardingCircleView = computed(() => route.name === 'journey' && journeyState.value === 'boardingCircle')
const isBoardingProcessingView = computed(() => route.name === 'journey' && journeyState.value === 'boardingProcessing')
const isSynchronizingBoardingView = computed(() => route.name === 'journey' && journeyState.value === 'synchronizingBoarding')
const isBoardingBackgroundView = computed(() => (isBoardingCircleView.value || isBoardingProcessingView.value) && !boardingPassGenerated.value)
const isBoardingBgPaddingView = computed(() => (isBoardingCircleView.value || isBoardingProcessingView.value || isSynchronizingBoardingView.value) && !boardingPassGenerated.value)
const isOnboardView = computed(() => route.name === 'journey' && journeyState.value === 'onboard')
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
        <div v-if="needsPersonalization" class="review-stack review-stack--intro">
          <section class="intro-section">
            <p class="intro-description">
              This is the boarding process for a flight with <span style="font-weight: bold; color: #f7af43;">Meridian Space</span>, a fictional company from a near future where space travel is routine. Meridian guides passengers through the terminal, using their device to sync at each station and move safely toward their flight. <span style="font-weight: bold;">Enter your name to personalize the experience.</span>
            </p>
            <div class="personalize-card">
              <v-text-field
                v-model="nameInput"
                label="Your name"
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
        </div>

        <div v-else class="review-stack">
          <section :class="['phone-shell', { 'phone-shell--welcome': isWelcomeJourneyView }]">

            <section :class="['shell-content', { 'shell-content--welcome': isWelcomeJourneyView, 'shell-content--lobby': isLobbyLikeView, 'shell-content--checkin': isCheckInBgPaddingView, 'shell-content--security': isSecurityBgPaddingView, 'shell-content--lounge': isLoungeBgPaddingView, 'shell-content--boarding': isBoardingBgPaddingView, 'shell-content--onboard': isOnboardView }]" :style="isWelcomeJourneyView ? { backgroundImage: `url(${heroImage})` } : isLobbyBgImageView ? { backgroundImage: `url(${lobbyBgImage})` } : isCheckInBackgroundView ? { backgroundImage: `url(${checkinBgImage})` } : isSecurityBackgroundView ? { backgroundImage: `url(${securityBgImage})` } : isLoungeCircleView ? { backgroundImage: `url(${loungeBgImage})` } : isBoardingBackgroundView ? { backgroundImage: `url(${boardingBgImage})` } : isOnboardView ? { backgroundImage: `url(${onboardBgImage})` } : {}">
              <RouterView />
            </section>
          </section>

          <div class="review-controls">
            <ResetButton :disabled="needsPersonalization" :on-click="resetJourney" />
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
  box-sizing: border-box;
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
  background: #f7af43;
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
  padding: 8px 20px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid rgba(231, 231, 231, 0.14);
  background: linear-gradient(180deg, rgba(12, 20, 45, 0.82) 0%, rgba(10, 16, 36, 0.72) 100%);
}

.shell-logo {
  width: 110px;
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
  max-height: 100%;
  padding: 14px 16px 0;
  overflow-y: auto;
}

.shell-content--welcome {
  flex: 1;
  max-height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 115%;
  background-position: center;
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
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--welcome > * {
  position: relative;
  z-index: 1;
}

.shell-content--lobby {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--lobby::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--lobby > * {
  position: relative;
  z-index: 1;
}

.shell-content--checkin {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--checkin::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--checkin > * {
  position: relative;
  z-index: 1;
}

.shell-content--security {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--security::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--security > * {
  position: relative;
  z-index: 1;
}

.shell-content--lounge {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--lounge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--lounge > * {
  position: relative;
  z-index: 1;
}

.shell-content--boarding {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--boarding::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--boarding > * {
  position: relative;
  z-index: 1;
}

.shell-content--onboard {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.shell-content--onboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 15, 45, 0.80);
  pointer-events: none;
  z-index: 0;
}

.shell-content--onboard > * {
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

.review-stack--intro {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 32px);
  padding: 40px 20px;
  box-sizing: border-box;
}

.intro-section {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intro-title {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 700;
  color: #f7af43;
  letter-spacing: 0.02em;
  text-align: center;
}

.intro-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(231, 231, 231, 0.85);
  text-align: left;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.personalize-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.personalize-input {
  font-size: 1rem;
}

.personalize-btn {
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
</style>
