<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useFlightState } from '@/composables/useFlightState'

const route = useRoute()
const router = useRouter()
const { resetJourney } = useFlightState()

const activeTab = computed({
  get: () => String(route.name ?? 'journey'),
  set: (name: string) => {
    if (String(route.name) !== name) {
      router.push({ name })
    }
  },
})
</script>

<template>
  <v-app>
    <div class="meridian-bg">
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>

      <main class="review-frame">
        <div class="review-stack">
          <section class="phone-shell">
            <header class="shell-header">
              <p class="shell-label">Meridian Space</p>
              <h1 class="shell-title">Meridian Flight</h1>
            </header>

            <section class="shell-content">
              <RouterView />
            </section>

            <v-bottom-navigation
              v-model="activeTab"
              grow
              class="shell-nav"
              bg-color="transparent"
              density="comfortable"
            >
              <v-btn value="journey">
                <v-icon>mdi-map-marker-path</v-icon>
                <span>Journey</span>
              </v-btn>
              <v-btn value="status">
                <v-icon>mdi-wifi</v-icon>
                <span>Status</span>
              </v-btn>
              <v-btn value="pass">
                <v-icon>mdi-wallet-membership</v-icon>
                <span>Pass</span>
              </v-btn>
            </v-bottom-navigation>
          </section>

          <div class="review-controls">
            <v-btn
              variant="outlined"
              rounded="xl"
              prepend-icon="mdi-restore"
              class="reset-btn"
              @click="resetJourney"
            >
              Reset Experience
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
  background: #f9c784;
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

.shell-header {
  padding: 18px 20px 10px;
}

.shell-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(231, 231, 231, 0.72);
}

.shell-title {
  margin: 4px 0 0;
  font-size: 1.35rem;
  color: #e7e7e7;
  letter-spacing: 0.02em;
}

.shell-content {
  flex: 1;
  padding: 8px 16px 0;
  overflow-y: auto;
}

.shell-nav {
  border-top: 1px solid rgba(231, 231, 231, 0.14);
  background: rgba(9, 15, 34, 0.75) !important;
}

.review-controls {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.reset-btn {
  border-color: rgba(249, 199, 132, 0.7);
  color: #f9c784;
  background: rgba(9, 15, 34, 0.55);
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

  .review-controls {
    padding-top: 14px;
  }
}
</style>
