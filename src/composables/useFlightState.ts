import { computed, readonly, ref, watch } from 'vue'
import flightStatus from '@/data/flight-status.json'

export type JourneyStage = {
  id: number
  kind: 'welcome' | 'journey'
  routeLabel: string
  icon: string
  locationLead: string
  location: string
  destination: string
  destinationLabel: string
  instruction: string
  supportingDetail?: string
  completionMessage?: string
  requiredItems?: string[]
  primaryInfo?: string
  actionLabel: string | null
  processingSequence: string[]
}

export type JourneyState =
  | 'welcome'
  | 'synchronizingLobby'
  | 'lobbyCircle'
  | 'checkInReady'
  | 'synchronizingCheckIn'
  | 'checkInCircle'
  | 'checkInProcessing'
  | 'securityCircle'
  | 'synchronizingSecurity'
  | 'securityProcessing'
  | 'synchronizingLounge'
  | 'loungeCircle'
  | 'nowBoarding'
  | 'synchronizingBoarding'
  | 'boardingCircle'
  | 'boardingProcessing'
  | 'onboard'

type SecurityRoute = 'express' | 'standard' | null

const stages: JourneyStage[] = [
  {
    id: 0,
    kind: 'welcome',
    routeLabel: 'Start',
    icon: 'send',
    locationLead: '',
    location: 'Welcome to Meridian Flight',
    destination: 'Passenger Lobby Circle',
    destinationLabel: 'Begin at',
    instruction: 'Head over to the Passenger Lobby Circle and tap Begin Arrival once you are there.',
    supportingDetail: 'Flight M102  •  Launch 10:45 AM  •  Vehicle Aurora 07',
    actionLabel: 'Begin Arrival',
    processingSequence: [],
  },
  {
    id: 1,
    kind: 'journey',
    routeLabel: 'Lobby',
    icon: 'users',
    locationLead: '',
    location: 'Passenger Lobby Circle',
    destination: 'Check-in Circle B',
    destinationLabel: 'Next',
    instruction: '',
    actionLabel: null,
    processingSequence: [],
  },
  {
    id: 2,
    kind: 'journey',
    routeLabel: 'Check-in',
    icon: 'user-check',
    locationLead: '',
    location: 'Check-in Circle B',
    destination: '',
    destinationLabel: '',
    instruction: '',
    actionLabel: null,
    processingSequence: [
      'Identity verified',
      'Baggage registered',
      'Confirming travel clearance',
      'Preparing boarding credentials',
      'Check-in complete',
    ],
  },
  {
    id: 3,
    kind: 'journey',
    routeLabel: 'Security',
    icon: 'shield',
    locationLead: '',
    location: 'Security Circle',
    destination: '',
    destinationLabel: '',
    instruction: '',
    actionLabel: null,
    processingSequence: [],
  },
  {
    id: 4,
    kind: 'journey',
    routeLabel: 'Lounge',
    icon: 'arrow-right',
    locationLead: '',
    location: 'Departure Lounge Circle C4',
    destination: '',
    destinationLabel: '',
    instruction: '',
    actionLabel: null,
    processingSequence: [],
  },
  {
    id: 5,
    kind: 'journey',
    routeLabel: 'Onboard',
    icon: 'navigation',
    locationLead: '',
    location: 'Onboard',
    destination: '',
    destinationLabel: '',
    instruction: '',
    actionLabel: null,
    processingSequence: [],
  },
]

const CHECK_IN_SEQUENCE = [
  'Verifying identity',
  'Identity confirmed',
  'Registering baggage',
  'Baggage accepted',
  'Confirming travel clearance',
  'Check-in complete',
]

const SECURITY_SEQUENCE = [
  'Verifying identity',
  'Validating boarding credentials',
  'Scanning passenger',
  'Screening carry-on items',
  'Security clearance granted',
]

const BOARDING_SEQUENCE = [
  'Scanning boarding credential',
  'Confirming seat assignment',
  'Passenger onboard',
]

const BOARDING_PASS_SEQUENCE = [
  'Generating boarding pass',
  'Pass ready',
]

const STORAGE_KEY = 'meridian-flight-stage-index'
const FLOW_STORAGE_KEY = 'meridian-flight-journey-state'
const NAME_STORAGE_KEY = 'meridian-flight-passenger-first-name'
const ROUTE_STORAGE_KEY = 'meridian-flight-security-route'
const CHECKIN_STORAGE_KEY = 'meridian-flight-checkin-complete'

function mapLegacyIndexToState(index: number): JourneyState {
  if (index <= 0) {
    return 'welcome'
  }
  if (index === 1) {
    return 'lobbyCircle'
  }
  if (index === 2) {
    return 'checkInCircle'
  }
  if (index === 4) {
    return 'loungeCircle'
  }
  return 'onboard'
}

function getInitialCheckInComplete(initialState: JourneyState): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const stored = window.localStorage.getItem(CHECKIN_STORAGE_KEY)
  if (stored === 'true') {
    return true
  }

  if (stored === 'false') {
    return false
  }

  return initialState === 'checkInCircle' || initialState === 'securityCircle' || initialState === 'securityProcessing' || initialState === 'loungeCircle' || initialState === 'nowBoarding' || initialState === 'boardingCircle' || initialState === 'boardingProcessing' || initialState === 'onboard'
}

function getInitialSecurityRoute(): SecurityRoute {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(ROUTE_STORAGE_KEY)
  if (stored === 'express' || stored === 'standard') {
    return stored
  }

  return null
}

function getInitialJourneyState(): JourneyState {
  if (typeof window === 'undefined') {
    return 'welcome'
  }

  const stored = window.localStorage.getItem(FLOW_STORAGE_KEY)
  if (
    stored === 'welcome' ||
    stored === 'synchronizingLobby' ||
    stored === 'lobbyCircle' ||
    stored === 'checkInReady' ||
    stored === 'synchronizingCheckIn' ||
    stored === 'checkInCircle' ||
    stored === 'checkInProcessing' ||
    stored === 'synchronizingSecurity' ||
    stored === 'securityCircle' ||
    stored === 'securityProcessing' ||
    stored === 'synchronizingLounge' ||
    stored === 'loungeCircle' ||
    stored === 'nowBoarding' ||
    stored === 'synchronizingBoarding' ||
    stored === 'boardingCircle' ||
    stored === 'boardingProcessing' ||
    stored === 'onboard'
  ) {
    return stored
  }

  const legacy = Number(window.localStorage.getItem(STORAGE_KEY))
  if (Number.isInteger(legacy)) {
    return mapLegacyIndexToState(legacy)
  }

  return 'welcome'
}

const journeyState = ref<JourneyState>(getInitialJourneyState())
const passengerFirstName = ref('')
const securityRoute = ref<SecurityRoute>(getInitialSecurityRoute())
const checkInComplete = ref<boolean>(getInitialCheckInComplete(journeyState.value))
const securityComplete = ref<boolean>(false)
const loungeReady = ref<boolean>(false)
const loungeCountdownSeconds = ref<number>(0)
const boardingCircleReady = ref<boolean>(false)
const boardingPassGenerated = ref<boolean>(false)
const isProcessing = ref(false)
const processingSteps = ref<string[]>([])
const activeProcessingIndex = ref(-1)
const nowMs = ref(Date.now())
let processingRunId = 0
let countdownIntervalId: ReturnType<typeof setInterval> | null = null

if (typeof window !== 'undefined') {
  passengerFirstName.value = window.localStorage.getItem(NAME_STORAGE_KEY) ?? ''
}

watch(passengerFirstName, (value) => {
  if (typeof window !== 'undefined') {
    if (value) {
      window.localStorage.setItem(NAME_STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(NAME_STORAGE_KEY)
    }
  }
})

watch(securityRoute, (value) => {
  if (typeof window !== 'undefined') {
    if (value) {
      window.localStorage.setItem(ROUTE_STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(ROUTE_STORAGE_KEY)
    }
  }
})

watch(checkInComplete, (value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CHECKIN_STORAGE_KEY, value ? 'true' : 'false')
  }
})

watch(journeyState, (value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(FLOW_STORAGE_KEY, value)
  }
})

setInterval(() => {
  nowMs.value = Date.now()
}, 1000)

const configuredLaunchTimeMs = Date.parse(flightStatus.launchTime)
const launchTimeMs =
  Number.isFinite(configuredLaunchTimeMs) && configuredLaunchTimeMs > Date.now()
    ? configuredLaunchTimeMs
    : Date.now() + 27 * 60 * 1000

const routeStages = computed(() => stages.filter((stage) => stage.kind === 'journey'))

const majorStageIndex = computed(() => {
  if (journeyState.value === 'welcome') {
    return -1
  }
  if (journeyState.value === 'synchronizingLobby' || journeyState.value === 'lobbyCircle' || journeyState.value === 'checkInReady') {
    return 0
  }
  if (journeyState.value === 'synchronizingCheckIn' || journeyState.value === 'checkInCircle' || journeyState.value === 'checkInProcessing') {
    return 1
  }
  if (journeyState.value === 'synchronizingSecurity' || journeyState.value === 'securityCircle' || journeyState.value === 'securityProcessing') {
    return 2
  }
  if (journeyState.value === 'synchronizingLounge' || journeyState.value === 'loungeCircle') {
    return 3
  }
  if (journeyState.value === 'nowBoarding' || journeyState.value === 'synchronizingBoarding' || journeyState.value === 'boardingCircle' || journeyState.value === 'boardingProcessing') {
    return 4
  }
  return 4
})

const routeStageIndex = computed(() => majorStageIndex.value)

const currentStageIndex = computed(() => Math.max(majorStageIndex.value + 1, 0))

watch(currentStageIndex, (value) => {
  if (typeof window !== 'undefined') {
    // Keep legacy numeric key in sync for compatibility with existing checks.
    window.localStorage.setItem(STORAGE_KEY, String(value))
  }
})

const completedStageCount = computed(() => Math.max(routeStageIndex.value, 0))

const journeyProgressPercent = computed(() => {
  const denominator = Math.max(routeStages.value.length - 1, 1)
  return Math.round((completedStageCount.value / denominator) * 100)
})

const activeStage = computed<JourneyStage>(() => {
  if (journeyState.value === 'welcome') {
    return stages[0]!
  }

  return stages[Math.max(majorStageIndex.value + 1, 1)]!
})

const liveCountdown = computed(() => {
  const diff = Math.max(0, launchTimeMs - nowMs.value)
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return `T-${hh}:${mm}:${ss}`
})

const journeyStatusText = computed(() => {
  switch (journeyState.value) {
    case 'welcome':
      return 'Arrival not started'
    case 'lobbyCircle':
      return 'At Passenger Lobby Circle'
    case 'checkInProcessing':
      return 'Check-in Circle B processing'
    case 'checkInCircle':
      return checkInComplete.value ? 'At Check-in Circle with next routing assigned' : 'At Check-in Circle'
    case 'securityCircle':
      return securityComplete.value ? 'At Security Circle with next routing assigned' : 'At Security Circle'
    case 'securityProcessing':
      return securityRoute.value === 'express' ? 'Express Security processing' : 'Standard Security processing'
    case 'loungeCircle':
      return 'At Departure Lounge Circle C4'
    case 'boardingProcessing':
      return 'Boarding in progress'
    case 'onboard':
      return 'Passenger onboard'
    default:
      return 'Journey active'
  }
})

const boardingStatus = computed(() => {
  if (journeyState.value === 'onboard') {
    return 'Boarding complete'
  }

  if (journeyState.value === 'boardingProcessing' || journeyState.value === 'loungeCircle') {
    return 'Boarding sequence opening shortly'
  }

  return 'Awaiting passenger movement from lounge'
})

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function runProcessing(sequence: string[], completeState: JourneyState): Promise<void> {
  processingRunId += 1
  const runId = processingRunId

  isProcessing.value = true
  processingSteps.value = [...sequence]
  activeProcessingIndex.value = -1

  for (let index = 0; index < sequence.length; index += 1) {
    if (runId !== processingRunId) {
      return
    }

    activeProcessingIndex.value = index
    await delay(760)
  }

  if (runId !== processingRunId) {
    return
  }

  await delay(420)
  journeyState.value = completeState
  processingSteps.value = []
  activeProcessingIndex.value = -1
  isProcessing.value = false
}

async function startCheckInProcessing(): Promise<void> {
  await runProcessing(CHECK_IN_SEQUENCE, 'checkInCircle')
  checkInComplete.value = true
}

async function startSecurityProcessing(): Promise<void> {
  await runProcessing(SECURITY_SEQUENCE, 'securityCircle')
  securityComplete.value = true
}

async function startBoardingPassProcessing(): Promise<void> {
  await runProcessing(BOARDING_PASS_SEQUENCE, 'boardingCircle')
  boardingPassGenerated.value = true
}

function startLoungeCountdown(): void {
  loungeCountdownSeconds.value = 13
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId)
  }
  countdownIntervalId = setInterval(() => {
    loungeCountdownSeconds.value -= 1
    if (loungeCountdownSeconds.value <= 0) {
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId)
        countdownIntervalId = null
      }
      journeyState.value = 'nowBoarding'
    }
  }, 1000)
}

async function advanceJourney(): Promise<void> {
  if (isProcessing.value) {
    return
  }

  if (journeyState.value === 'welcome') {
    journeyState.value = 'synchronizingLobby'
    
    // Auto-advance after 4 seconds
    setTimeout(() => {
      if (journeyState.value === 'synchronizingLobby') {
        journeyState.value = 'lobbyCircle'
      }
    }, 4000)
    return
  }

  if (journeyState.value === 'lobbyCircle') {
    journeyState.value = 'checkInReady'
    return
  }

  if (journeyState.value === 'checkInReady') {
    journeyState.value = 'synchronizingCheckIn'
    checkInComplete.value = false
    securityRoute.value = null
    
    // Auto-advance after 4 seconds
    setTimeout(() => {
      if (journeyState.value === 'synchronizingCheckIn') {
        journeyState.value = 'checkInCircle'
      }
    }, 4000)
    return
  }

  if (journeyState.value === 'checkInCircle') {
    if (!checkInComplete.value) {
      journeyState.value = 'checkInProcessing'
      void startCheckInProcessing()
      return
    }

    // Moving from check-in to security - show sync screen first
    journeyState.value = 'synchronizingSecurity'
    
    // Auto-advance after 4 seconds to security circle
    setTimeout(() => {
      if (journeyState.value === 'synchronizingSecurity') {
        journeyState.value = 'securityCircle'
        securityComplete.value = false
        securityRoute.value = 'standard'
      }
    }, 4000)
    return
  }

  if (journeyState.value === 'securityCircle') {
    if (!securityComplete.value) {
      journeyState.value = 'securityProcessing'
      void startSecurityProcessing()
      return
    }

    // Moving from security to lounge - show sync screen first
    journeyState.value = 'synchronizingLounge'
    
    // Auto-advance after 4 seconds to lounge circle
    setTimeout(() => {
      if (journeyState.value === 'synchronizingLounge') {
        journeyState.value = 'loungeCircle'
        loungeReady.value = true
        startLoungeCountdown()
      }
    }, 4000)
    return
  }

  if (journeyState.value === 'loungeCircle') {
    return
  }

  if (journeyState.value === 'nowBoarding') {
    journeyState.value = 'synchronizingBoarding'
    
    // Auto-advance after 4 seconds to boarding circle
    setTimeout(() => {
      if (journeyState.value === 'synchronizingBoarding') {
        journeyState.value = 'boardingCircle'
        boardingCircleReady.value = true
      }
    }, 4000)
    return
  }

  if (journeyState.value === 'boardingCircle') {
    if (!boardingPassGenerated.value) {
      journeyState.value = 'boardingProcessing'
      void startBoardingPassProcessing()
      return
    }

    journeyState.value = 'onboard'
    return
  }

  if (journeyState.value === 'boardingProcessing') {
    journeyState.value = 'onboard'
  }
}

function resetJourney(): void {
  processingRunId += 1
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId)
    countdownIntervalId = null
  }
  isProcessing.value = false
  processingSteps.value = []
  activeProcessingIndex.value = -1
  journeyState.value = 'welcome'
  passengerFirstName.value = ''
  securityRoute.value = null
  checkInComplete.value = false
  securityComplete.value = false
  loungeReady.value = false
  loungeCountdownSeconds.value = 0
  boardingCircleReady.value = false
  boardingPassGenerated.value = false
}

function setPassengerFirstName(name: string): boolean {
  const trimmed = name.trim()

  if (!trimmed) {
    return false
  }

  passengerFirstName.value = trimmed
  return true
}

function setExpressVerification(completed: boolean): void {
  securityRoute.value = completed ? 'express' : 'standard'
}

// Image preloading for performance
function preloadImage(imagePath: string): void {
  if (!imagePath) return
  const img = new Image()
  img.src = imagePath
}

// Map journey states to their background images
function getNextImageForState(state: JourneyState): string {
  // Import the actual image files for preloading
  const imageMap: Record<JourneyState, string> = {
    welcome: '',
    synchronizingLobby: new URL('@/images/lobby_bg.jpg', import.meta.url).href,
    lobbyCircle: new URL('@/images/lobby_bg.jpg', import.meta.url).href,
    checkInReady: new URL('@/images/checkin_bg.jpg', import.meta.url).href,
    synchronizingCheckIn: new URL('@/images/checkin_bg.jpg', import.meta.url).href,
    checkInCircle: new URL('@/images/checkin_bg.jpg', import.meta.url).href,
    checkInProcessing: new URL('@/images/checkin_bg.jpg', import.meta.url).href,
    securityCircle: new URL('@/images/security_bg.jpg', import.meta.url).href,
    synchronizingSecurity: new URL('@/images/security_bg.jpg', import.meta.url).href,
    securityProcessing: new URL('@/images/security_bg.jpg', import.meta.url).href,
    synchronizingLounge: new URL('@/images/lounge_bg.jpg', import.meta.url).href,
    loungeCircle: new URL('@/images/lounge_bg.jpg', import.meta.url).href,
    nowBoarding: new URL('@/images/boarding_bg.jpg', import.meta.url).href,
    synchronizingBoarding: new URL('@/images/boarding_bg.jpg', import.meta.url).href,
    boardingCircle: new URL('@/images/boarding_bg.jpg', import.meta.url).href,
    boardingProcessing: new URL('@/images/boarding_bg.jpg', import.meta.url).href,
    onboard: new URL('@/images/onboard_bg.jpg', import.meta.url).href,
  }
  return imageMap[state] || ''
}

// Preload all background images and logo images on app init
function preloadAllImages(): void {
  // Preload all background images
  preloadImage(new URL('@/images/hero2.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/lobby_bg.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/checkin_bg.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/security_bg.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/lounge_bg.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/boarding_bg.jpg', import.meta.url).href)
  preloadImage(new URL('@/images/onboard_bg.jpg', import.meta.url).href)
  
  // Preload logo images
  preloadImage(new URL('@/images/MS_logo.png', import.meta.url).href)
  preloadImage(new URL('@/images/MS_logoV.png', import.meta.url).href)
}

// Call preload on init
preloadAllImages()

export function useFlightState() {
  return {
    flightStatus,
    stages: readonly(stages),
    routeStages,
    routeStageIndex,
    activeStage,
    currentStageIndex: readonly(currentStageIndex),
    completedStageCount,
    journeyProgressPercent,
    journeyState: readonly(journeyState),
    isProcessing: readonly(isProcessing),
    processingSteps: readonly(processingSteps),
    activeProcessingIndex: readonly(activeProcessingIndex),
    liveCountdown,
    journeyStatusText,
    boardingStatus,
    checkInComplete: readonly(checkInComplete),
    securityComplete: readonly(securityComplete),
    loungeReady: readonly(loungeReady),
    loungeCountdownSeconds: readonly(loungeCountdownSeconds),
    boardingCircleReady: readonly(boardingCircleReady),
    boardingPassGenerated: readonly(boardingPassGenerated),
    passengerFirstName: readonly(passengerFirstName),
    securityRoute: readonly(securityRoute),
    setPassengerFirstName,
    setExpressVerification,
    advanceJourney,
    resetJourney,
  }
}
