<script setup lang="ts">
  import { CloseSmall } from '@icon-park/vue-next'

  type Toast = {
    flag: boolean
    msg: string
  }
  const toasts = ref<Toast[]>([
    {
      id: 0,
      flag: true,
      msg: '登录成功'
    },
    {
      id: 1,
      flag: false,
      msg: '账号或密码错误'
    },
    {
      id: 2,
      flag: false,
      msg: '厨房和萨度线擦上新娘当场姆加德你娃上学额外的飞洒等下私底下加密哦我是苦笑都没呢扫测今晚考试模拟的讽刺哦啊发送的批次v均免费发'
    }
  ])
</script>

<template>
  <div class="pack">
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
      <CloseSmall />
    </div>
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
</style>
