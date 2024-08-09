<script setup lang="ts">
  import type { CookieRef } from '#app'
  import { Mail, Lock, Protect } from '@icon-park/vue-next'
  const form = ref({
    account: '',
    password: '',
    code: ''
  })
  const options = ref(['密码登录', '验证码登录'])
  const option = ref<number>(0)
  const keep = useCookie('keep', {
    maxAge: 60 * 60 * 24 * 365
  })
  keep.value = keep.value || 'true'
  const remember = ref(true)
  watch(remember, newValue => {
    keep.value = `${newValue}`
  })
  const token = useCookie('token', {
    maxAge: !!keep.value ? 60 * 60 * 24 * 365 : undefined
  })
  const addToast = useToast()
  const router = useRouter()
  token.value = token.value || ''
  const loading = ref(false)
  async function login() {
    loading.value = true
    const data = await $fetch(option.value ? '/api/auth/token' : '/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    addToast(data)
    loading.value = false
    if (data.flag) {
      token.value = data.data
      router.push('/')
    }
  }
  async function sendcode() {
    const data = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: {
        account: form.value.account,
        index: 2
      }
    })
    addToast(data)
  }
</script>

<template>
  <div class="background">
    <div class="card">
      <img class="illustration" src="/illustration.webp" alt="登录页插画" />
      <form class="form" @submit.prevent="login">
        <h1>班诺网格</h1>
        <BnTabs v-model="option" :options />
        <BnInput
          type="email"
          placeholder="请输入您的账号"
          v-model="form.account"
          autofocus
          required
        >
          <Mail />
        </BnInput>
        <div class="view">
          <div class="main" :style="{ transform: `translateX(-${option * 50}%)` }">
            <div class="inputs">
              <BnInput
                type="password"
                placeholder="请输入您的密码"
                v-model="form.password"
              >
                <Lock />
              </BnInput>
            </div>
            <div class="inputs">
              <BnInput
                type="code"
                placeholder="请输入验证码"
                :mail="form.account"
                v-model="form.code"
                @send="sendcode"
              >
                <Protect />
              </BnInput>
            </div>
          </div>
        </div>
        <div class="footer">
          <BnToggle v-model="remember">记住密码</BnToggle>
          <BnButton type="submit" :loading>登录</BnButton>
        </div>
      </form>
      <img class="logo" src="/icon-white.png" alt="白色图标" />
    </div>
  </div>
</template>

<style scoped>
  .background {
    position: relative;
    height: 100%;
  }
  .card {
    position: absolute;
    inset: 0;
    width: 660px;
    max-width: calc(100% - 60px);
    height: 400px;
    max-height: calc(100% - 60px);
    display: flex;
    border-radius: 9px;
    overflow: hidden;
    box-shadow: 0 0 6px #1e1e1e80;
    margin: auto;
  }
  .illustration {
    width: 36%;
    height: 100%;
  }
  .form {
    width: 64%;
    height: 100%;
    background-color: #1e1e1e80;
    backdrop-filter: blur(30px);
    padding: 36px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .logo {
    position: absolute;
    left: 9px;
    top: 9px;
    width: 36px;
    height: 36px;
  }
  .view {
    width: 100%;
    overflow: hidden;
  }
  .main {
    width: 200%;
    display: flex;
  }
  .inputs {
    width: 50%;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media (orientation: portrait) {
    .card {
      width: 420px;
      height: 60%;
    }
    .illustration {
      display: none;
    }
    .form {
      width: 100%;
    }
    .logo {
      display: none;
    }
  }
</style>
