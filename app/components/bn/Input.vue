<script lang="ts" setup>
  import { CloseSmall, PreviewCloseOne, PreviewOpen } from '@icon-park/vue-next'

  const props = defineProps<{
    placeholder: string
    type: string
    required?: true
    autofocus?: true
    mail?: string
  }>()
  const emit = defineEmits<{
    send: []
  }>()
  const value = defineModel<string>()
  function reset() {
    value.value = ''
  }
  function toggle() {
    preview.value = !preview.value
  }
  const preview = ref(false)
  const truetype = computed(() => {
    switch (props.type) {
      case 'password':
        if (preview.value) {
          return 'text'
        }
        return 'password'
      case 'code':
        return 'text'
      default:
        return props.type
    }
  })
  const passed = computed(() => {
    if (props.mail) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(props.mail)
    }
    return false
  })
  const countdown = ref(0)
  function sendcode() {
    if (countdown.value) {
      return
    }
    countdown.value = 60
    const timer = setInterval(() => {
      if (!--countdown.value) {
        clearInterval(timer)
      }
    }, 1000)
    emit('send')
  }
</script>

<template>
  <div class="pack">
    <slot />
    <input
      :id="`${type}input`"
      class="input"
      :type="truetype"
      v-model="value"
      :autocomplete="type"
      placeholder=""
      :autofocus
      :required
      :minlength="type === 'password' ? 8 : type === 'code' ? 6 : undefined"
      :maxlength="type === 'code' ? 6 : undefined"
    />
    <span class="placeholder">{{ placeholder }}</span>
    <label
      v-if="type === 'password'"
      :for="`${type}input`"
      class="inputbutton button"
      @click="toggle"
    >
      <PreviewCloseOne
        v-if="preview"
        theme="outline"
        size="18"
        fill="#ffffff"
        :strokeWidth="3"
      />
      <PreviewOpen v-else />
    </label>
    <Transition v-else-if="type === 'code'">
      <span v-if="passed" class="button" @click="sendcode">{{
        countdown ? `重新发送（${countdown}秒）` : '发送验证码'
      }}</span>
    </Transition>
    <label v-else :for="`${type}input`" class="inputbutton button" @click="reset">
      <CloseSmall />
    </label>
  </div>
</template>

<style scoped>
  .pack {
    position: relative;
    display: flex;
    align-items: end;
    justify-content: space-between;
    border-bottom: var(--error-color) 2px solid;
    height: 60px;
    padding: 6px 9px;
  }
  .pack:has(:valid) {
    border-bottom-color: var(--theme-color);
  }
  .pack:focus-within,
  .pack:has(:placeholder-shown) {
    border-bottom-color: #ffffff;
  }
  .input {
    min-width: 0;
    position: absolute;
    height: 27px;
    inset-inline: 0;
    bottom: 6px;
    background-color: transparent;
    padding-inline: 36px;
    outline: none;
    border: none;
    color: #ffffff;
    z-index: 10;
  }
  .input:autofill {
    -webkit-text-fill-color: #ffffff;
    transition: background-color 86400s step-end;
  }
  .placeholder {
    position: absolute;
    bottom: 6px;
    left: 36px;
  }
  .input:focus ~ .placeholder,
  .input:not(:placeholder-shown) ~ .placeholder {
    bottom: 36px;
    left: 36px;
    font-size: 12px;
    line-height: 15px;
  }
  .inputbutton {
    z-index: 20;
    opacity: 0;
  }
  .button {
    z-index: 20;
  }
  .input:not(:placeholder-shown):hover ~ .inputbutton,
  .input:not(:placeholder-shown):focus ~ .inputbutton {
    opacity: 1;
  }
</style>
