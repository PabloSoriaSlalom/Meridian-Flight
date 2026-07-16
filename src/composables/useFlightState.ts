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

const stages: JourneyStage[] = [
  {
    id: 0,
    kind: 'welcome',
    routeLabel: 'Start',
    icon: 'mdi-rocket-launch-outline',
    locationLead: 'Good morning, Pablo.',
    location: 'Welcome to your Meridian Flight',
    destination: 'Meridian Passenger Lobby Entrance',
    destinationLabel: 'Begin at',
    instruction: 'Begin your arrival once you reach the entrance to the Meridian Passenger Lobby.',
    supportingDetail: 'Flight M102  •  Launch 10:45 AM  •  Vehicle Aurora 07',
    actionLabel: 'Begin Arrival',
    processingSequence: [],
  },
  {
    id: 1,
    kind: 'journey',
    routeLabel: 'Lobby',
    icon: 'mdi-office-building-marker-outline',
    locationLead: 'You are at',
    location: 'Meridian Passenger Lobby',
    destination: 'Counter B',
    destinationLabel: 'Next',
    instruction: 'Proceed to Counter B.',
    supportingDetail: 'Approximately 2 minutes away.',
    actionLabel: 'Begin Check-in',
    processingSequence: [
      'Verifying identity',
      'Identity confirmed',
      'Registering baggage',
      'Baggage accepted',
      'Confirming travel clearance',
      'Check-in complete',
    ],
  },
  {
    id: 2,
    kind: 'journey',
    routeLabel: 'Check-in',
    icon: 'mdi-account-check-outline',
    locationLead: 'You are at',
    location: 'Check-in Counter B',
    destination: 'Terminal C Security',
    destinationLabel: 'Next',
    completionMessage: 'Check-in complete',
    instruction: 'Follow the blue guidance line.',
    requiredItems: ['Government ID', 'Boarding Credential'],
    actionLabel: 'Begin Security',
    processingSequence: [
      'Validating boarding credential',
      'Credential confirmed',
      'Completing screening',
      'Security cleared',
    ],
  },
  {
    id: 3,
    kind: 'journey',
    routeLabel: 'Security',
    icon: 'mdi-shield-check-outline',
    locationLead: 'You are at',
    location: 'Terminal C Security',
    destination: 'Departure Lounge C4',
    destinationLabel: 'Next',
    completionMessage: 'Security cleared',
    instruction: 'Follow the blue guidance line.',
    supportingDetail: 'Approximately 4 minutes away.',
    actionLabel: 'Continue to Lounge',
    processingSequence: [],
  },
  {
    id: 4,
    kind: 'journey',
    routeLabel: 'Lounge',
    icon: 'mdi-sofa-outline',
    locationLead: 'You are at',
    location: 'Departure Lounge C4',
    destination: '',
    destinationLabel: '',
    primaryInfo: 'Boarding begins in 18 minutes.',
    instruction: 'Stay nearby.',
    supportingDetail: 'Launch remains on schedule.',
    actionLabel: 'Begin Boarding',
    processingSequence: [
      'Scanning boarding credential',
      'Confirming seat assignment',
      'Passenger onboard',
    ],
  },
  {
    id: 5,
    kind: 'journey',
    routeLabel: 'Onboard',
    icon: 'mdi-airplane-takeoff',
    locationLead: 'You are',
    location: 'Onboard',
    destination: '',
    destinationLabel: '',
    instruction: 'Enjoy the view.',
    supportingDetail: 'Cabin secured. Launch on schedule.',
    actionLabel: null,
    processingSequence: [],
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
const processingSteps = ref<string[]>([])
const activeProcessingIndex = ref(-1)
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

const routeStages = computed(() => stages.filter((stage) => stage.kind === 'journey'))

const routeStageIndex = computed(() => {
  if (activeStage.value.kind === 'welcome') {
    return -1
  }

  return routeStages.value.findIndex((stage) => stage.id === activeStage.value.id)
})

const completedStageCount = computed(() => Math.max(routeStageIndex.value, 0))

const journeyProgressPercent = computed(() => {
  const denominator = Math.max(routeStages.value.length - 1, 1)
  return Math.round((completedStageCount.value / denominator) * 100)
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
  if (activeStage.value.kind === 'welcome') {
    return 'Arrival not started'
  }

  if (currentStageIndex.value === stages.length - 1) {
    return 'Passenger onboard'
  }

  return `At ${activeStage.value.location}`
})

const boardingStatus = computed(() => {
  if (currentStageIndex.value < 4) {
    return 'Awaiting passenger movement from lounge'
  }
  if (currentStageIndex.value === 4) {
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
  const current = activeStage.value
  const sequence = current.processingSequence

  if (sequence.length === 0) {
    isProcessing.value = true
    await delay(320)
    if (runId !== processingRunId) {
      return
    }

    currentStageIndex.value += 1
    isProcessing.value = false
    return
  }

  isProcessing.value = true
  processingSteps.value = [...sequence]

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
  currentStageIndex.value += 1
  processingSteps.value = []
  activeProcessingIndex.value = -1
  isProcessing.value = false
}

function resetJourney(): void {
  processingRunId += 1
  isProcessing.value = false
  processingSteps.value = []
  activeProcessingIndex.value = -1
  currentStageIndex.value = 0
}

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
    isProcessing: readonly(isProcessing),
    processingSteps: readonly(processingSteps),
    activeProcessingIndex: readonly(activeProcessingIndex),
    liveCountdown,
    journeyStatusText,
    boardingStatus,
    advanceJourney,
    resetJourney,
  }
}
