<script setup lang="ts">
  import { Login } from '@icon-park/vue-next'

  defineProps<{
    type: 'button' | 'submit' | 'reset' | undefined
    loading: boolean
  }>()
</script>

<template>
  <button :class="loading ? 'disable' : 'button'" :disabled="loading" :type>
    <Transition mode="out-in">
      <BnLoading v-if="loading" :size="1.8" />
      <Login v-else />
    </Transition>
    <span><slot /></span>
  </button>
</template>

<style scoped>
  .button {
    background-color: var(--theme-color);
    border: none;
    outline: none;
    padding: 6px 18px;
    border-radius: 6px;
    color: #1e1e1e;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .disable {
    background-color: var(--theme-color);
    border: none;
    outline: none;
    padding: 6px 18px;
    border-radius: 6px;
    color: #1e1e1e;
    display: flex;
    align-items: center;
    filter: brightness(0.6);
    gap: 9px;
    cursor: not-allowed;
  }
</style>
