<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'
import FeatherIcon from '@/components/FeatherIcon.vue'
import welcomeLogo from '@/images/MS_logo.png'

const {
  routeStages,
  routeStageIndex,
  journeyState,
  checkInComplete,
  securityComplete,
  loungeReady,
  loungeCountdownSeconds,
  boardingCircleReady,
  boardingPassGenerated,
  passengerFirstName,
  securityRoute,
  isProcessing,
  processingSteps,
  activeProcessingIndex,
  liveCountdown,
  advanceJourney,
  activeStage,
} = useFlightState()

const isWelcome = computed(() => journeyState.value === 'welcome')
const isLobbyCircle = computed(() => journeyState.value === 'lobbyCircle')
const isCheckInCircle = computed(() => journeyState.value === 'checkInCircle')
const isCheckInReadyScreen = computed(() => isCheckInCircle.value && !checkInComplete.value)
const isCheckInProcessing = computed(() => journeyState.value === 'checkInProcessing')
const isSecurityCircle = computed(() => journeyState.value === 'securityCircle')
const isSecurityReadyScreen = computed(() => isSecurityCircle.value && !securityComplete.value)
const isSecurityProcessing = computed(() => journeyState.value === 'securityProcessing')
const isLoungeCircle = computed(() => journeyState.value === 'loungeCircle')
const isLoungeReadyScreen = computed(() => isLoungeCircle.value && !loungeReady.value)
const isLoungeCountdown = computed(() => isLoungeCircle.value && loungeReady.value && loungeCountdownSeconds.value > 0)
const isNowBoarding = computed(() => journeyState.value === 'nowBoarding')
const isBoardingCircle = computed(() => journeyState.value === 'boardingCircle')
const isBoardingCircleReady = computed(() => isBoardingCircle.value && !boardingPassGenerated.value)
const isBoardingProcessing = computed(() => journeyState.value === 'boardingProcessing')
const isBoardingPassShowing = computed(() => isBoardingCircle.value && boardingPassGenerated.value)
const isOnboard = computed(() => journeyState.value === 'onboard')

const completedProcessingIndex = computed(() => activeProcessingIndex.value - 1)
const welcomeGreeting = computed(() => `Good morning, ${passengerFirstName.value}.`)

const routeInstruction = computed(() => {
  if (journeyState.value === 'lobbyCircle') {
    return {
      current: 'Passenger Lobby Circle',
      route: 'Blue Route',
      destination: 'Check-in Circle',
      detail: 'Follow the blue line to Check-in Circle, tap the button below once you are there.',
      walk: 'Approximately 2 minutes.',
      action: "I'm at the Check-in Circle",
    }
  }

  if (journeyState.value === 'securityCircle' && securityComplete.value) {
    return {
      current: securityRoute.value === 'express' ? 'Express Security Circle' : 'Standard Security Circle',
      route: 'Blue Line',
      destination: 'Departure Lounge Circle',
      detail: 'Follow the blue line to the Departure Lounge Cirlce.',
      walk: 'Approximately 4 minutes.',
      action: "I'm at Departure Lounge Circle",
    }
  }

  return null
})

const processContext = computed(() => {
  if (journeyState.value === 'checkInProcessing') {
    return {
      location: 'Check-in Circle B',
      status: 'Check-in processing is underway.',
    }
  }

  if (journeyState.value === 'securityProcessing') {
    return {
      location: securityRoute.value === 'express' ? 'Express Security Circle' : 'Standard Security Circle',
      status: 'Security screening is underway.',
    }
  }

  if (journeyState.value === 'boardingProcessing') {
    return {
      location: 'Boarding Platform',
      status: 'Generating boarding pass...',
    }
  }

  return null
})

const primaryActionLabel = computed(() => {
  if (isLobbyCircle.value) {
    return "I'm Inside the Circle"
  }

  if (isCheckInCircle.value && !checkInComplete.value) {
    return 'Check me in'
  }

  if (isCheckInCircle.value && checkInComplete.value) {
    return "I'm at Security Circle"
  }

  if (isSecurityReadyScreen.value) {
    return 'Begin Security'
  }

  if (isSecurityCircle.value && securityComplete.value) {
    return "I'm at Departure Lounge Circle"
  }

  if (isLoungeCountdown.value) {
    return null
  }

  if (isNowBoarding.value) {
    return "I'm at the Boarding Circle"
  }

  if (isBoardingCircleReady.value) {
    return 'Generate Boarding Pass'
  }

  if (isBoardingPassShowing.value) {
    return 'Continue'
  }

  if (routeInstruction.value) {
    return routeInstruction.value.action
  }

  return null
})

const showBottomAction = computed(
  () => !isWelcome.value && !isProcessing.value && !isBoardingProcessing.value && !!primaryActionLabel.value,
)

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
            <FeatherIcon v-if="index < routeStageIndex" name="check-circle" size="16" color="#f1c98a" />
          </span>
          <span class="stop-label">{{ stage.routeLabel }}</span>
          <span v-if="index < routeStages.length - 1" class="stop-link"></span>
        </li>
      </ol>
    </div>

    <div v-if="isLobbyCircle" class="lobby-outside lobby-outside--lobby">
      <h2 class="lobby-location">Welcome to the Meridian Passenger Lobby Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f1c98a" />
      </div>
      <p class="lobby-guidance">
        Meridian guides every passenger through a series of Circles connected by dedicated Routes. Each Circle securely synchronizes your device with the next stage of departure.
      </p>
      <p class="lobby-guidance">
        Follow the <span class="route-emphasis">Blue Route</span> to the <span class="route-emphasis">Check-in Circle</span>. Once inside, tap <span class="route-emphasis">I'm Inside the Circle</span> to begin the check-in process.
      </p>
    </div>

    <div v-if="isCheckInReadyScreen" class="lobby-outside">
      <h2 class="lobby-location">Check-in Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f1c98a" />
      </div>
      <p class="lobby-guidance">
        The Check-in Circle lets you check in to your flight. Tap below to begin check-in.
      </p>
    </div>

    <div v-if="isCheckInCircle && checkInComplete" class="lobby-outside lobby-outside--checkin-complete">
      <p class="checkin-complete-line"><span class="welcome-emphasis">Check-in Complete!</span></p>
      <p class="lobby-guidance lobby-guidance--compact">continue to the next circle.</p>
    </div>

    <div v-if="isSecurityReadyScreen" class="lobby-outside">
      <h2 class="lobby-location">Security Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f1c98a" />
      </div>
      <p class="lobby-guidance">
        Remain inside the Security Circle and tap Begin Sucurty Screening to beging the security screening process
      </p>
    </div>

    <div v-if="isSecurityCircle && securityComplete" class="lobby-outside lobby-outside--checkin-complete">
      <p class="checkin-complete-line"><span class="welcome-emphasis">Security Cleared!</span></p>
      <p class="lobby-guidance lobby-guidance--compact">proceed to departure lounge.</p>
    </div>

    <div v-if="isLoungeCircle" class="lobby-outside">
      <h2 class="lobby-location">Departure Lounge Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f1c98a" />
      </div>
      <p class="lobby-guidance lobby-guidance--waiting">
        Please wait in the Departure Lounge Circle until boarding begins
      </p>
      <p class="countdown-display">
        Boarding will begin in <span class="countdown-timer">{{ loungeCountdownSeconds }}s</span>
      </p>
    </div>

    <div v-if="isNowBoarding" class="lobby-outside">
      <h2 class="lobby-location lobby-location--boarding">NOW BOARDING!</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon name="activity" size="56" color="#f1c98a" />
      </div>
    </div>

    <div v-if="isBoardingCircleReady" class="lobby-outside">
      <h2 class="lobby-location">Boarding Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon name="plane" size="56" color="#f1c98a" />
      </div>
      <p class="lobby-guidance">
        Tap the button below to Generate your boarding pass and show it to the attendant.
      </p>
    </div>

    <div v-if="isBoardingProcessing" class="lobby-outside lobby-outside--processing">
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon name="loader" size="54" color="#f1c98a" class="icon-spin" />
      </div>
      <p class="lobby-guidance lobby-guidance--generating">
        Generating your unique Boarding pass<span class="dot-animation">...</span>
      </p>
    </div>

    <div v-if="isBoardingPassShowing" class="lobby-outside">
      <h2 class="lobby-location">Boarding Pass</h2>
      <div class="boarding-pass-qr">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="qr-placeholder">
          <rect width="100" height="100" fill="white" />
          <rect x="10" y="10" width="20" height="20" fill="black" />
          <rect x="70" y="10" width="20" height="20" fill="black" />
          <rect x="10" y="70" width="20" height="20" fill="black" />
          <circle cx="50" cy="50" r="15" fill="black" opacity="0.5" />
        </svg>
      </div>
      <p class="lobby-guidance">
        Show this pass to the attendant.
      </p>
    </div>

    <div v-if="isOnboard" class="lobby-outside">
      <h2 class="lobby-location">You are Onboard</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="54" color="#f1c98a" />
      </div>
      <p class="completion-message">Boarding complete</p>
    </div>

    <section
      v-if="!isCheckInReadyScreen && !isSecurityReadyScreen && !isLoungeReadyScreen && !isLoungeCountdown && !isBoardingCircleReady && !isBoardingProcessing && !isBoardingPassShowing && !isLobbyCircle"
      :class="[
        'stage-panel',
        {
          'stage-panel--welcome': isWelcome,
          'stage-panel--centered': isLobbyCircle || (isCheckInCircle && checkInComplete) || (isSecurityCircle && securityComplete),
        },
      ]"
    >
      <div v-if="!isWelcome && !isLobbyCircle && !isCheckInCircle && !isCheckInProcessing && !isSecurityCircle && !isSecurityProcessing && !isLoungeCircle && !isNowBoarding && !isOnboard" class="icon-wrap">
        <FeatherIcon :name="activeStage.icon" size="54" color="#f1c98a" />
      </div>

      <template v-if="isWelcome">
        <div class="welcome-hero">
          <div class="welcome-content">
            <img :src="welcomeLogo" alt="Meridian Flight" class="welcome-logo" />
            <p class="where-lead">{{ welcomeGreeting }}</p>
            <h2 class="where-name">Welcome to Meridian Spaceport</h2>
            <p class="welcome-flight-info">Flight M102</p>
            <p class="instruction">
              Your journey begins at the <span class="welcome-emphasis">Passenger Lobby Circle</span>, a designated area within the spaceport.
            </p>
            <p class="instruction">
              Walk into the Circle. Once inside, tap <span class="action-emphasis">I'm Inside the Circle</span> to begin your journey.
            </p>

            <v-btn
              block
              size="x-large"
              rounded="xl"
              class="action-btn action-btn--welcome"
              @click="advanceJourney"
            >
              I'm Inside the Circle
            </v-btn>
          </div>
        </div>
      </template>

      <template v-else>
        <template v-if="isCheckInCircle && checkInComplete">
          <p class="next-label">Next circle</p>
          <h3 class="dominant route-name">Security Circle</h3>
          <p class="instruction">Follow the line to Security Circle, tap the button below once you are there.</p>
        </template>

        <template v-else-if="isCheckInProcessing">
          <p class="checkin-process-title">Check-in in process</p>
        </template>

        <template v-else-if="isSecurityCircle && securityComplete">
          <p class="next-label">Next circle</p>
          <h3 class="dominant route-name">Departure Lounge Circle</h3>
          <p class="instruction">Follow the blue line to the Departure Lounge Cirlce and tap the button below once you are there.</p>
        </template>

        <template v-else-if="isSecurityProcessing">
          <p class="checkin-process-title">Security screening in process</p>
        </template>

        <template v-else-if="isNowBoarding">
          <p class="next-label">Next circle</p>
          <h3 class="dominant route-name">Boarding Circle</h3>
          <p class="instruction">Follow the blue line to the boarding circle. Tap the button below once you are there.</p>
        </template>

        <template v-else-if="isLoungeCircle && loungeReady && !isLoungeCountdown">
          <p class="where-lead">You are at</p>
          <h2 class="where-name">Departure Lounge Circle C4</h2>
          <p class="next-label">Boarding</p>
          <h3 class="dominant">Boarding begins in 18 minutes.</h3>
          <p class="supporting">Launch remains on schedule.</p>
        </template>

        <template v-else-if="routeInstruction && !isLobbyCircle">
          <p class="where-lead">Current location</p>
          <h2 class="where-name">{{ routeInstruction.current }}</h2>

          <p class="next-label">Assigned route</p>
          <h3 class="dominant route-name">{{ routeInstruction.route }}</h3>

          <p class="next-label">Next circle</p>
          <p class="instruction">{{ routeInstruction.destination }}</p>
          <p class="instruction">{{ routeInstruction.detail }}</p>
          <p class="supporting">Estimated walk: {{ routeInstruction.walk }}</p>
        </template>

        <template v-else-if="processContext">
          <p class="where-lead">Current location</p>
          <h2 class="where-name">{{ processContext.location }}</h2>
          <p class="completion-message">{{ processContext.status }}</p>
        </template>

        <template v-else-if="isOnboard">
          <p class="next-label">Seat assignment</p>
          <h3 class="dominant">Seat 14A</h3>

          <p class="next-label">Live launch countdown</p>
          <h3 class="dominant countdown">{{ liveCountdown }}</h3>
          
          <p class="supporting">Launch on schedule.</p>
          <p class="supporting">Enjoy the view.</p>
        </template>
      </template>

      <v-expand-transition>
        <div :class="['processing-checklist', { 'processing-checklist--bare': isCheckInProcessing || isSecurityProcessing }]" v-if="isProcessing">
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
      v-if="showBottomAction"
      block
      size="x-large"
      rounded="xl"
      class="action-btn"
      @click="advanceJourney"
    >
      {{ primaryActionLabel }}
    </v-btn>
  </section>
</template>

<style scoped>
.journey-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
}

.journey-view--welcome {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
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
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid rgba(231, 231, 231, 0.25);
  background: rgba(72, 86, 150, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f1c98a;
  z-index: 1;
}

.stop-label {
  font-size: 0.48rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.42);
}

.stop-link {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(231, 231, 231, 0.08);
}

.route-stop.completed .stop-dot {
  background: rgba(241, 201, 138, 0.22);
  border-color: rgba(241, 201, 138, 0.75);
}

.route-stop.current .stop-dot {
  background: #f1c98a;
  border-color: #f1c98a;
  box-shadow: 0 0 0 3px rgba(241, 201, 138, 0.2);
}

.route-stop.current .stop-label {
  color: rgba(241, 201, 138, 0.92);
  font-weight: 700;
}

.route-stop.future .stop-dot {
  opacity: 0.5;
}

.route-stop.completed .stop-link {
  background: rgba(241, 201, 138, 0.35);
}

.stage-panel {
  background: linear-gradient(135deg, rgba(10, 15, 27, 0.98), rgba(26, 42, 74, 0.95));
  border: 1px solid rgba(241, 201, 138, 0.15);
  border-radius: 28px;
  padding: 36px 28px;
  color: #e7e7e7;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.stage-panel--centered {
  text-align: center;
}

.stage-panel--welcome {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  border-radius: 0;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  box-shadow: none;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.welcome-hero {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  position: relative;
  z-index: 1;
  width: min(340px, calc(100% - 32px));
  max-height: calc(100% - 32px);
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(241, 201, 138, 0.12);
  border: 1.5px solid rgba(241, 201, 138, 0.25);
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.icon-wrap:hover {
  border-color: rgba(241, 201, 138, 0.45);
  background: rgba(241, 201, 138, 0.18);
}

.icon-wrap--outside {
  margin: 14px 0 10px;
}

.lobby-outside {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 2px 0 2px;
}

.lobby-outside--checkin-complete {
  min-height: 118px;
  justify-content: center;
}

.lobby-outside--lobby {
  min-height: 220px;
  justify-content: center;
}

.lobby-location {
  margin: 0;
  font-size: 1.6rem;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.lobby-location--boarding {
  font-size: 1.7rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.lobby-you-are {
  margin: 0;
  color: #f1c98a;
  letter-spacing: 0.04em;
  text-transform: lowercase;
}

.lobby-guidance {
  margin: 8px 0 2px;
  max-width: 34ch;
  color: rgba(231, 231, 231, 0.9);
  line-height: 1.4;
}

.lobby-guidance + .lobby-guidance {
  margin-top: 12px;
}

.lobby-guidance--compact {
  margin-top: 2px;
}

.lobby-guidance--waiting {
  margin: 4px 0 12px;
  font-size: 0.95rem;
}

.countdown-display {
  margin: 8px 0 0;
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(231, 231, 231, 0.95);
  letter-spacing: 0.02em;
}

.countdown-timer {
  font-weight: 600;
  color: #f1c98a;
  font-size: 1.6rem;
  letter-spacing: 0.02em;
}

.checkin-complete-line {
  margin: 0;
  font-size: 1.1rem;
}

.welcome-logo {
  width: min(260px, 75%);
  height: auto;
  margin: 0 0 32px;
  border-radius: 6px;
}

.where-lead {
  margin: 0;
  font-size: 1rem;
  color: rgba(231, 231, 231, 0.95);
}

.where-name {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.15;
  color: #ffffff;
  font-weight: 500;
}

.welcome-flight-info {
  margin: 2px 0 0;
  font-size: 1rem;
  letter-spacing: 0.04em;
  color: #f1c98a;
}

.next-label {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.58);
  font-weight: 500;
}

.dominant {
  margin: 0 0 20px;
  font-size: 2rem;
  line-height: 1;
  font-weight: 600;
  color: #f1c98a;
  letter-spacing: -0.01em;
}

.route-name {
  margin-bottom: 14px;
}

.countdown {
  font-size: 2.45rem;
  letter-spacing: 0.05em;
}

.completion-message {
  margin: 0 0 10px;
  color: rgba(241, 201, 138, 0.98);
  font-size: 0.9rem;
  letter-spacing: 0.03em;
}

.instruction {
  margin: 20px 0 0;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 33ch;
  color: rgba(231, 231, 231, 0.88);
}

.instruction + .instruction {
  margin-top: 8px;
}

.route-emphasis {
  font-weight: 600;
  color: #f1c98a;
}

.action-emphasis {
  font-weight: 600;
  color: #f1c98a;
}

.welcome-emphasis {
  font-weight: 600;
  color: #ffffff;
}

.supporting {
  margin: 4px 0 0;
  max-width: 34ch;
  line-height: 1.5;
  color: rgba(231, 231, 231, 0.75);
  font-size: 0.95rem;
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
  margin-top: 18px;
  border-top: 1px solid rgba(231, 231, 231, 0.1);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.processing-checklist--bare {
  margin-top: 8px;
  border-top: 0;
  padding-top: 0;
}

.checkin-process-title {
  margin: 4px 0 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(231, 231, 231, 0.95);
  letter-spacing: 0.02em;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.check-row.done,
.check-row.active {
  opacity: 1;
}

.check-symbol {
  width: 16px;
  text-align: center;
  color: #f1c98a;
  font-size: 0.95rem;
}

.check-row p {
  margin: 0;
  font-size: 0.92rem;
  color: rgba(231, 231, 231, 0.9);
}

.verification-options {
  margin-top: 6px;
}

.route-outcome {
  margin: 2px 0 14px;
}

.outcome-lead {
  margin: 0 0 6px;
  color: rgba(241, 201, 138, 0.98);
}

.action-btn {
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(74, 86, 147, 0.3);
}

.action-btn:hover {
  box-shadow: 0 12px 32px rgba(74, 86, 147, 0.5);
  transform: translateY(-2px);
}

.action-btn--welcome {
  margin-top: 32px;
  width: 100%;
  max-width: 320px;
  transform: none !important;
}

.action-btn--welcome:hover,
.action-btn--welcome:focus,
.action-btn--welcome:active {
  transform: none !important;
}

.boarding-pass-qr {
  width: 140px;
  height: 140px;
  margin: 16px auto;
  padding: 8px;
  background: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dot-animation {
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%,
  100% {
    content: '...';
  }
}

.lobby-outside--processing {
  min-height: 180px;
  justify-content: center;
}

.lobby-guidance--generating {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(231, 231, 231, 0.95);
}

@media (max-width: 360px) {
  .route-line {
    min-width: 360px;
  }
}
</style>
