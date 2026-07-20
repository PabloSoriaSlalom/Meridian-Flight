<script setup lang="ts">
interface Props {
  disabled?: boolean
  onClick: () => void
  label?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  label: 'Reset Experience',
})
</script>

<template>
  <v-btn
    :disabled="disabled"
    variant="text"
    size="small"
    rounded="xl"
    class="reset-btn"
    @click="onClick"
  >
    <span>{{ label }}</span>
  </v-btn>
</template>

<style scoped>
.reset-btn {
  color: rgba(231, 231, 231, 0.6);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.reset-btn:not(:disabled):hover {
  color: rgba(231, 231, 231, 1);
  background-color: rgba(247, 175, 67, 0.1);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
