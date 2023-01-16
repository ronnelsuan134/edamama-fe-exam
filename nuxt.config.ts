import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  ssr: false,
  css: [
    '~/assets/css/tailwind.css',
    'primevue/resources/themes/saga-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css'
  ],
  publicRuntimeConfig: {
    baseApiUrl: process.env.API_BASE_URL,
  },
  build: {
    transpile: ['primevue']
  },
  plugins: [
    '~/plugins/persistedstate'
  ],
})
