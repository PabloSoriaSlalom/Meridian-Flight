<script setup lang="ts">
import { computed } from 'vue'
import { useFlightState } from '@/composables/useFlightState'
import FeatherIcon from '@/components/FeatherIcon.vue'
import welcomeLogo from '@/images/MS_logoV.png'
import lobbyBg from '@/images/lobby_bg.jpg'

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
const isSynchronizingCheckIn = computed(() => journeyState.value === 'synchronizingCheckIn')
const isCheckInCircle = computed(() => journeyState.value === 'checkInCircle')
const isCheckInReadyScreen = computed(() => isCheckInCircle.value && !checkInComplete.value)
const isCheckInProcessing = computed(() => journeyState.value === 'checkInProcessing')
const isSecurityCircle = computed(() => journeyState.value === 'securityCircle')
const isSecurityReadyScreen = computed(() => isSecurityCircle.value && !securityComplete.value)
const isSecurityProcessing = computed(() => journeyState.value === 'securityProcessing')
const isSynchronizingSecurity = computed(() => journeyState.value === 'synchronizingSecurity')
const isSynchronizingLounge = computed(() => journeyState.value === 'synchronizingLounge')
const isSynchronizingBoarding = computed(() => journeyState.value === 'synchronizingBoarding')
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

  if (journeyState.value === 'checkInCircle' && checkInComplete.value) {
    return {
      current: 'Check-in Circle',
      route: 'Security Circle',
      destination: 'Security Circle',
      detail: 'Walk to the <span class="route-emphasis">Security Circle</span>. Follow the <span class="route-emphasis">Blue Route</span>. Once inside, tap the button below.',
      walk: 'Approximately 3 minutes.',
      action: "I'm Inside the Circle",
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

const dynamicProcessingTitle = computed(() => {
  if (isCheckInProcessing.value) {
    const checkInTitles = [
      'Checking identity...',
      'Registering baggage...',
      'Confirming travel clearance...',
      'Preparing boarding credentials...',
      'Check-in complete',
    ]
    return checkInTitles[activeProcessingIndex.value] || 'Check-in complete'
  }

  if (isSecurityProcessing.value) {
    const securityTitles = [
      'Verifying identity...',
      'Validating boarding credentials...',
      'Scanning passenger...',
      'Screening carry-on items...',
      'Security clearance granted',
    ]
    return securityTitles[activeProcessingIndex.value] || 'Security clearance granted'
  }

  if (isBoardingProcessing.value) {
    return 'Generating boarding pass...'
  }

  return 'Processing...'
})

const primaryActionLabel = computed(() => {
  if (isLobbyCircle.value) {
    return "I'm Inside the Circle"
  }

  if (isCheckInCircle.value && !checkInComplete.value) {
    return 'Check me in'
  }

  if (isCheckInCircle.value && checkInComplete.value) {
    return "I'm Inside the Circle"
  }

  if (isSecurityReadyScreen.value) {
    return 'Begin Security Screening'
  }

  if (isSecurityCircle.value && securityComplete.value) {
    return "I'm Inside the Circle"
  }

  if (isLoungeCountdown.value) {
    return null
  }

  if (isNowBoarding.value) {
    return "I'm Inside the Circle"
  }

  if (isBoardingCircleReady.value) {
    return 'Generate Boarding Credential'
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
  <section :class="['journey-view', { 'journey-view--welcome': isWelcome, 'journey-view--lobby': isLobbyCircle }]">
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
            <FeatherIcon v-if="index < routeStageIndex" name="check-circle" size="16" color="#f7af43" />
          </span>
          <span class="stop-label">{{ stage.routeLabel }}</span>
          <span v-if="index < routeStages.length - 1" class="stop-link"></span>
        </li>
      </ol>
    </div>

    <div v-if="isLobbyCircle" class="lobby-outside lobby-outside--lobby">
      <h2 class="lobby-location">Passenger Lobby Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        Meridian guides passengers through connected <span class="route-emphasis">Circles</span> and dedicated <span class="route-emphasis">Routes</span>.
      </p>
      <p class="lobby-guidance">
        Each <span class="route-emphasis">Circle</span> securely synchronizes your device with the next stage of your journey.
      </p>
      <div class="guidance-box">
        <p class="lobby-guidance">
          Walk over to the next <span class="route-emphasis">Circle</span>,<br />the <span class="route-emphasis">Check-in Circle</span>.
        </p>
        <p class="lobby-guidance">
          Follow the <span class="route-emphasis">Blue Route</span> to the <span class="route-emphasis">Circle</span>. Once inside, tap the button below to begin check-in.
        </p>
      </div>
    </div>

    <div v-if="isSynchronizingCheckIn" class="lobby-outside lobby-outside--sync">
      <h2 class="lobby-location">Synchronizing with <span class="route-emphasis">Check-in Circle</span>...</h2>
      <div class="sync-icon-wrap">
        <div class="sync-spinner-dual">
          <div class="sync-circle sync-circle-inner"></div>
          <div class="sync-circle sync-circle-outer"></div>
        </div>
      </div>
      <p class="lobby-guidance sync-text">
        Securing connection
      </p>
    </div>

    <div v-if="isCheckInReadyScreen" class="lobby-outside">
      <h2 class="lobby-location">Check-in Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        You're inside the <span class="route-emphasis">Check-in Circle</span>.
      </p>
      <p class="lobby-guidance">
        Your device is synchronized and ready.
      </p>
      <p class="lobby-guidance">
        Tap below to begin check-in.
      </p>
    </div>

    <div v-if="isCheckInCircle && checkInComplete" class="lobby-outside lobby-outside--checkin-complete">
      <p class="checkin-complete-line"><span class="welcome-emphasis">Check-in complete.</span></p>
      <p class="lobby-guidance lobby-guidance--compact">Continue to the <span class="route-emphasis">Security Circle</span>.</p>
    </div>

    <div v-if="isSynchronizingSecurity" class="lobby-outside lobby-outside--sync">
      <h2 class="lobby-location">Synchronizing with <span class="route-emphasis">Security Circle</span>...</h2>
      <div class="sync-icon-wrap">
        <div class="sync-spinner-dual">
          <div class="sync-circle sync-circle-inner"></div>
          <div class="sync-circle sync-circle-outer"></div>
        </div>
      </div>
      <p class="lobby-guidance sync-text">
        Securing connection
      </p>
    </div>

    <div v-if="isSecurityReadyScreen" class="lobby-outside">
      <h2 class="lobby-location">Security Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        You're inside the <span class="route-emphasis">Security Circle</span>.
      </p>
      <p class="lobby-guidance">
        Your device is synchronized and ready.
      </p>
      <p class="lobby-guidance">
        Tap below to begin security screening.
      </p>
    </div>

    <div v-if="isSecurityCircle && securityComplete" class="lobby-outside lobby-outside--checkin-complete">
      <p class="checkin-complete-line"><span class="welcome-emphasis">Security screening complete.</span></p>
      <p class="lobby-guidance lobby-guidance--compact">Continue to the <span class="route-emphasis">Departure Lounge Circle</span>.</p>
    </div>

    <div v-if="isSynchronizingLounge" class="lobby-outside lobby-outside--sync">
      <h2 class="lobby-location">Synchronizing with <span class="route-emphasis">Departure Lounge Circle</span>...</h2>
      <div class="sync-icon-wrap">
        <div class="sync-spinner-dual">
          <div class="sync-circle sync-circle-inner"></div>
          <div class="sync-circle sync-circle-outer"></div>
        </div>
      </div>
      <p class="lobby-guidance sync-text">
        Securing connection
      </p>
    </div>

    <div v-if="isLoungeCircle" class="lobby-outside">
      <h2 class="lobby-location">Departure Lounge Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        You're inside the <span class="route-emphasis">Departure Lounge Circle</span>.
      </p>
      <p class="lobby-guidance">
        Please remain inside the Circle until boarding begins.
      </p>
      <p class="countdown-display">
        Boarding will begin in <span class="countdown-timer">{{ loungeCountdownSeconds }}s</span>
      </p>
    </div>

    <div v-if="isNowBoarding" class="lobby-outside">
      <h2 class="lobby-location lobby-location--boarding">Boarding has begun.</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon name="play-circle" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        Continue to the <span class="route-emphasis">Boarding Circle</span>.
      </p>
    </div>

    <div v-if="isSynchronizingBoarding" class="lobby-outside lobby-outside--sync">
      <h2 class="lobby-location">Synchronizing with <span class="route-emphasis">Boarding Circle</span>...</h2>
      <div class="sync-icon-wrap">
        <div class="sync-spinner-dual">
          <div class="sync-circle sync-circle-inner"></div>
          <div class="sync-circle sync-circle-outer"></div>
        </div>
      </div>
      <p class="lobby-guidance sync-text">
        Securing connection
      </p>
    </div>

    <div v-if="isBoardingCircleReady" class="lobby-outside">
      <h2 class="lobby-location">Boarding Circle</h2>
      <div class="icon-wrap icon-wrap--outside">
      <FeatherIcon name="log-in" size="56" color="#f7af43" />
      </div>
      <p class="lobby-guidance">
        You're inside the <span class="route-emphasis">Boarding Circle</span>.
      </p>
      <p class="lobby-guidance">
        Your device is synchronized and ready.
      </p>
      <p class="lobby-guidance">
        Tap below to generate your <span class="route-emphasis">boarding credential</span>.
      </p>
    </div>

    <div v-if="isBoardingProcessing" class="lobby-outside lobby-outside--sync">
      <h2 class="lobby-location">Generating your boarding pass...</h2>
      <div class="sync-icon-wrap">
        <FeatherIcon name="loader" size="56" color="#f7af43" class="icon-spin" />
      </div>
      <p class="lobby-guidance sync-text">
        Please wait
      </p>
    </div>

    <div v-if="isBoardingPassShowing" class="lobby-outside">
      <h2 class="lobby-location">Boarding Pass</h2>
      <img src="@/images/pass.svg" alt="Boarding Pass QR Code" class="boarding-pass-image" />
      <div class="boarding-pass-container">
        <div class="boarding-pass-details">
          <div class="pass-detail">
            <p class="detail-label">Passenger</p>
            <p class="detail-value">{{ passengerFirstName }}</p>
          </div>
          <div class="pass-detail">
            <p class="detail-label">Flight</p>
            <p class="detail-value">M102</p>
          </div>
        </div>
      </div>
      <p class="lobby-guidance">
        Your boarding pass is ready.
      </p>
      <p class="lobby-guidance">
        Present this pass for boarding.
      </p>
    </div>

    <div v-if="isOnboard" class="lobby-outside">
      <h2 class="lobby-location">Welcome aboard.</h2>
      <div class="icon-wrap icon-wrap--outside">
        <FeatherIcon :name="activeStage.icon" size="54" color="#f7af43" />
      </div>
      <p class="mission-flight">Flight M102</p>
      
      <div class="mission-card">
        <div class="mission-details">
          <div class="mission-field">
            <p class="mission-label">Seat</p>
            <p class="mission-value">14A</p>
          </div>
          <div class="mission-field">
            <p class="mission-label">Mission</p>
            <p class="mission-value">LEO-1</p>
          </div>
        </div>
      </div>
      
      <p class="completion-message">Final launch preparations underway.</p>
    </div>

    <section
      v-if="!isCheckInReadyScreen && !isSecurityReadyScreen && !isLoungeReadyScreen && !isLoungeCountdown && !isBoardingCircleReady && !isBoardingProcessing && !isBoardingPassShowing && !isLobbyCircle && !isSynchronizingCheckIn && !isSynchronizingSecurity && !isSynchronizingLounge && !isSynchronizingBoarding"
      :class="[
        'stage-panel',
        {
          'stage-panel--welcome': isWelcome,
          'stage-panel--centered': isLobbyCircle || (isCheckInCircle && checkInComplete) || (isSecurityCircle && securityComplete) || isOnboard,
        },
      ]"
    >
      <div v-if="!isWelcome && !isLobbyCircle && !isCheckInCircle && !isCheckInProcessing && !isSecurityCircle && !isSecurityProcessing && !isLoungeCircle && !isNowBoarding && !isOnboard" class="icon-wrap">
        <FeatherIcon :name="activeStage.icon" size="54" color="#f7af43" />
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
            <div class="welcome-instruction-card">
              <p class="instruction instruction-main">
                Walk into the Circle. Once inside, tap <span class="action-emphasis">I'm Inside the Circle</span> to begin your journey.
              </p>
            </div>

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

      <template v-else-if="isCheckInProcessing">
        <p class="checkin-process-title">{{ dynamicProcessingTitle }}</p>
      </template>

      <template v-else>
        <template v-if="isSecurityCircle && securityComplete">
          <h3 class="dominant route-name boarding-center">Departure Lounge Circle</h3>
          <p class="instruction boarding-center">Walk to the <span class="route-emphasis">Departure Lounge Circle</span>.</p>
          <p class="instruction boarding-center">Follow the <span class="route-emphasis">Blue Route</span>. Once inside, tap the button below.</p>
        </template>

        <template v-else-if="isSecurityProcessing">
          <p class="checkin-process-title">{{ dynamicProcessingTitle }}</p>
        </template>

        <template v-else-if="isNowBoarding">
          <h3 class="dominant route-name boarding-center">Boarding Circle</h3>
          <p class="instruction boarding-center">Walk to the <span class="route-emphasis">Boarding Circle</span>.</p>
          <p class="instruction boarding-center">Follow the <span class="route-emphasis">Blue Route</span>. Once inside, tap the button below.</p>
        </template>

        <template v-else-if="isLoungeCircle && loungeReady && !isLoungeCountdown">
          <p class="where-lead">You are at</p>
          <h2 class="where-name">Departure Lounge Circle C4</h2>
          <p class="next-label">Boarding</p>
          <h3 class="dominant">Boarding begins in 18 minutes.</h3>
          <p class="supporting">Launch remains on schedule.</p>
        </template>

        <template v-else-if="routeInstruction && !isLobbyCircle">
          <h3 :class="['dominant', 'route-name', { 'boarding-center': isCheckInCircle && checkInComplete }]"><span class="route-emphasis">{{ routeInstruction.route }}</span></h3>

          <p v-if="!(isCheckInCircle && checkInComplete)" class="next-label">Next circle</p>
          <p v-if="!(isCheckInCircle && checkInComplete)" class="instruction">{{ routeInstruction.destination }}</p>
          <p v-if="!(isCheckInCircle && checkInComplete)" class="instruction">{{ routeInstruction.detail }}</p>
          <p v-if="isCheckInCircle && checkInComplete" :class="['instruction', 'boarding-center']">
            Walk to the <span class="route-emphasis">Security Circle</span>. Follow the <span class="route-emphasis">Blue Route</span>. Once inside, tap the button below.
          </p>
        </template>

        <template v-else-if="processContext">
          <p class="where-lead">Current location</p>
          <h2 class="where-name">{{ processContext.location }}</h2>
          <p class="completion-message">{{ processContext.status }}</p>
        </template>

        <template v-else-if="isOnboard">
          <p class="next-label">Live launch countdown</p>
          <h3 class="dominant countdown">{{ liveCountdown }}</h3>
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

    <div :class="['action-btn-wrap', { 'action-btn-wrap--padded': isLobbyCircle }]">
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
    </div>
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

.journey-view--lobby {
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
  padding-top: 28px;
  padding-bottom: 28px;
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
  color: #f7af43;
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
  background: #f7af43;
  border-color: #f7af43;
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
  padding: 0 16px 24px;
  flex: 1;
}

.lobby-location {
  margin: 0;
  font-size: 2.4rem;
  line-height: 1.15;
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
  color: #f7af43;
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

.guidance-box {
  border: 2px solid #f7af43;
  border-radius: 16px;
  padding: 20px 16px;
  margin: 20px 0;
  text-align: center;
  background: rgba(9, 15, 45, 0);
}

.guidance-box .lobby-guidance {
  margin: 0;
  max-width: none;
}

.guidance-box .lobby-guidance + .lobby-guidance {
  margin-top: 12px;
}

.guidance-box-title {
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 0.02em;
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
  color: #f7af43;
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
  margin: 0 0 0;
  border-radius: 6px;
}

.where-lead {
  margin: -12px 0 0 0;
  font-size: 1rem;
  color: #f7af43;
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
  color: #f7af43;
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
  color: #f7af43;
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

.welcome-instruction-card .instruction {
  margin: 0;
}

.instruction-main {
  font-size: 1.3rem;
}

.instruction + .instruction {
  margin-top: 8px;
}

.boarding-center {
  text-align: center;
  margin-left: auto !important;
  margin-right: auto !important;
}

.boarding-pass-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin: 20px 0;
  padding: 0 20px;
}

.boarding-pass-image {
  width: 144px;
  height: 144px;
  object-fit: contain;
  margin-top: 20px;
}

.boarding-pass-details {
  width: 100%;
  max-width: 280px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
  background: rgba(241, 201, 138, 0.03);
  border-radius: 12px;
}

.pass-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(231, 231, 231, 0.6);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f7af43;
  margin: 0;
  letter-spacing: -0.01em;
}

.detail-value.ready {
  color: #f7af43;
}

.route-emphasis {
  font-weight: 600;
  color: #f7af43;
}

.action-emphasis {
  font-weight: 600;
  color: #f7af43;
}

.welcome-emphasis {
  font-weight: 600;
  color: #ffffff;
}

.welcome-instruction-card {
  max-width: 320px;
  padding: 20px 16px;
  margin: 20px 0;
  background: rgba(9, 15, 45, 0);
  border: 2px solid #f7af43;
  border-radius: 16px;
  text-align: center;
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
  color: #f7af43;
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

.action-btn-wrap--padded {
  padding: 0 16px;
}

.action-btn--welcome {
  margin-top: 16px;
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

.lobby-outside--sync {
  min-height: 240px;
  justify-content: center;
}

.sync-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}

.sync-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-sync 3s ease-in-out infinite;
}

.sync-spinner-dual {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 80px;
  height: 80px;
}

.sync-circle {
  position: absolute;
  border: 2px solid #f7af43;
  border-radius: 50%;
}

.sync-circle-inner {
  width: 50px;
  height: 50px;
  animation: pulse-inner 2s ease-in-out infinite;
  opacity: 0.7;
}

.sync-circle-outer {
  width: 70px;
  height: 70px;
  animation: pulse-outer 3s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes pulse-sync {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}

@keyframes pulse-inner {
  0% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

@keyframes pulse-outer {
  0% {
    opacity: 0.4;
    transform: scale(1.1);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

.sync-text {
  font-size: 1rem;
  color: rgba(231, 231, 231, 0.8);
  text-align: center;
  margin: 0;
  max-width: 34ch;
}

.mission-flight {
  font-size: 1rem;
  font-weight: 500;
  color: #f7af43;
  margin: 12px 0 24px;
  text-align: center;
  letter-spacing: 0.02em;
}

.mission-card {
  width: 100%;
  max-width: 300px;
  margin: 24px 0;
  padding: 20px;
  background: rgba(241, 201, 138, 0.03);
  border-radius: 12px;
}

.mission-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #f7af43;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 16px 0;
  text-align: center;
}

.mission-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mission-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.mission-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(231, 231, 231, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.mission-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f7af43;
  margin: 0;
  letter-spacing: -0.01em;
}

@media (max-width: 360px) {
  .route-line {
    min-width: 360px;
  }
}
</style>
