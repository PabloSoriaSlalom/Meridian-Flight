<script setup lang="ts">
interface Props {
  label: string | null
  onClick: () => void
  variant?: 'continue' | 'welcome'
  wrapperClass?: string | Record<string, boolean>
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'welcome',
  show: true,
})
</script>

<template>
  <div v-if="show && label" :class="['action-btn-wrap', wrapperClass]">
    <v-btn
      block
      size="x-large"
      rounded="xl"
      :class="['action-btn', { 'action-btn--continue': variant === 'continue', 'action-btn--welcome': variant === 'welcome' }]"
      @click="onClick"
    >
      {{ label }}
    </v-btn>
  </div>
</template>

<style scoped>
.action-btn-wrap {
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
}

.action-btn {
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 86, 147, 0.3);
}

.action-btn:hover {
  box-shadow: 0 12px 32px rgba(74, 86, 147, 0.5);
  transform: translateY(-2px);
}

.action-btn--continue {
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
}

.action-btn--welcome {
  background: linear-gradient(135deg, #4a5693 0%, #3a4682 100%);
}

.action-btn--welcome:hover,
.action-btn--welcome:focus,
.action-btn--welcome:active {
  box-shadow: 0 12px 32px rgba(74, 86, 147, 0.5);
  transform: translateY(-2px);
}
</style>
