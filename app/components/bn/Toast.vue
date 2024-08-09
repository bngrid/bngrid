<script setup lang="ts">
  const toasts = useToasts()
</script>

<template>
  <div class="pack">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :style="{
          borderColor: toast.flag ? 'var(--theme-color)' : 'var(--error-color)',
          color: toast.flag ? 'var(--theme-color)' : 'var(--error-color)'
        }"
      >
        <span>{{ toast.msg }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .pack {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
  .toast {
    width: 360px;
    max-width: calc(100vw - 60px);
    padding: 15px;
    background-color: #1e1e1e80;
    color: #ffffff;
    margin-top: 15px;
    border-radius: 6px;
    backdrop-filter: blur(30px);
    box-shadow: 0 0 6px #1e1e1e80;
    border-left: 6px solid;
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
