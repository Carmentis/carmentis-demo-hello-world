import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@cmts-dev/carmentis-desk-connect-vuejs/style.css'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { ToastService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'none',
      cssVariables: true,
    },
  },
})

app.mount('#app')
