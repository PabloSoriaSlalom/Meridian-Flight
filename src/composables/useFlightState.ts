import { computed, readonly, ref, watch } from 'vue'
import flightStatus from '@/data/flight-status.json'

export type JourneyStage = {
  id: number
  label: string
  icon: string
  headline: string
  instruction: string
  actionLabel: string
  processingSteps: string[]
  info: string[]
}

const stages: JourneyStage[] = [
  {
    id: 1,
    label: 'Passenger Lobby',
    icon: 'mdi-office-building-marker-outline',
    headline: "You're in the right place.",
    instruction: 'Proceed to Check-in Counter B and follow the blue overhead guidance line.',
    actionLabel: 'Begin Check-in',
    processingSteps: [
      'Locating your reservation',
      'Preparing check-in record',
      'Opening counter assignment',
    ],
    info: ['Counter B is active', 'Blue line guidance is available'],
  },
  {
    id: 2,
    label: 'Check-in',
    icon: 'mdi-account-check-outline',
    headline: 'Check-in in progress.',
    instruction: 'Have your Boarding Credential and Government ID ready for Terminal C Security.',
    actionLabel: 'Begin Security',
    processingSteps: [
      'Confirming reservation',
      'Verifying identity',
      'Registering baggage',
      'Validating travel clearance',
    ],
    info: ['Proceed next to Terminal C Security'],
  },
  {
    id: 3,
    label: 'Security',
    icon: 'mdi-shield-check-outline',
    headline: 'Security screening.',
    instruction: 'Continue toward the Departure Lounge after screening confirmation.',
    actionLabel: 'Continue to Departure Lounge',
    processingSteps: ['Scanning credential', 'Reviewing screening lane status', 'Confirming security clearance'],
    info: ['Terminal C Security lanes are flowing normally'],
  },
  {
    id: 4,
    label: 'Departure Lounge',
    icon: 'mdi-sofa-outline',
    headline: 'Departure Lounge reached.',
    instruction: 'Boarding begins shortly. Stay nearby and keep your credential visible.',
    actionLabel: 'Begin Boarding',
    processingSteps: ['Preparing boarding corridor', 'Verifying cabin readiness', 'Opening boarding group sequence'],
    info: ['Boarding begins in approximately 20 minutes', 'Launch remains on schedule'],
  },
  {
    id: 5,
    label: 'Onboard',
    icon: 'mdi-airplane-takeoff',
    headline: 'Boarding complete.',
    instruction: 'You are seated and ready for launch. Enjoy the view.',
    actionLabel: '',
    processingSteps: [],
    info: ['Seat 14A', 'Launch remains on schedule'],
  },
]

const STORAGE_KEY = 'meridian-flight-stage-index'

function getInitialStageIndex(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  const parsed = Number(stored)

  if (!Number.isInteger(parsed)) {
    return 0
  }

  return Math.min(Math.max(parsed, 0), stages.length - 1)
}

const currentStageIndex = ref(getInitialStageIndex())
const isProcessing = ref(false)
const processingMessage = ref('')
const nowMs = ref(Date.now())
let processingRunId = 0

watch(currentStageIndex, (value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, String(value))
  }
})

setInterval(() => {
  nowMs.value = Date.now()
}, 1000)

const configuredLaunchTimeMs = Date.parse(flightStatus.launchTime)
const launchTimeMs =
  Number.isFinite(configuredLaunchTimeMs) && configuredLaunchTimeMs > Date.now()
    ? configuredLaunchTimeMs
    : Date.now() + 2 * 60 * 60 * 1000

const activeStage = computed<JourneyStage>(() => stages[Math.min(currentStageIndex.value, stages.length - 1)]!)

const completedStageCount = computed(() => currentStageIndex.value)

const journeyProgressPercent = computed(() => Math.round((completedStageCount.value / (stages.length - 1)) * 100))

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
  if (currentStageIndex.value === stages.length - 1) {
    return 'Passenger onboard'
  }

  return `Stage ${currentStageIndex.value + 1} of ${stages.length}: ${activeStage.value.label}`
})

const boardingStatus = computed(() => {
  if (currentStageIndex.value < 3) {
    return 'Awaiting passenger movement from lounge'
  }
  if (currentStageIndex.value === 3) {
    return 'Boarding sequence opening shortly'
  }
  return 'Boarding complete'
})

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function advanceJourney(): Promise<void> {
  if (isProcessing.value || currentStageIndex.value >= stages.length - 1) {
    return
  }

  processingRunId += 1
  const runId = processingRunId
  isProcessing.value = true
  const current = activeStage.value

  for (const step of current.processingSteps) {
    if (runId !== processingRunId) {
      return
    }

    processingMessage.value = step
    await delay(900)
  }

  if (runId !== processingRunId) {
    return
  }

  await delay(500)
  currentStageIndex.value += 1
  processingMessage.value = ''
  isProcessing.value = false
}

function resetJourney(): void {
  processingRunId += 1
  isProcessing.value = false
  processingMessage.value = ''
  currentStageIndex.value = 0
}

export function useFlightState() {
  return {
    flightStatus,
    stages: readonly(stages),
    activeStage,
    currentStageIndex: readonly(currentStageIndex),
    completedStageCount,
    journeyProgressPercent,
    isProcessing: readonly(isProcessing),
    processingMessage: readonly(processingMessage),
    liveCountdown,
    journeyStatusText,
    boardingStatus,
    advanceJourney,
    resetJourney,
  }
}
