<script setup lang="ts">
  const value = defineModel<boolean>()
</script>

<template>
  <div class="pack">
    <input type="checkbox" id="check" v-model="value" class="check button" />
    <label for="check"><slot /></label>
  </div>
</template>

<style scoped>
  .pack {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .check {
    appearance: none;
    width: 48px;
    height: 24px;
    background-color: #e1e1e180;
    border-radius: 6px;
    position: relative;
    outline: none;
  }
  .check::after {
    content: '';
    height: 18px;
    position: absolute;
    background-color: #1e1e1e80;
    top: 3px;
    left: 3px;
    right: 27px;
    border-radius: 4.5px;
  }
  .check:active::after {
    right: 3px;
  }
  .check:checked {
    background-color: var(--theme-color);
  }
  .check:checked::after {
    left: 27px;
    right: 3px;
  }
  .check:checked:active::after {
    left: 3px;
  }
</style>
