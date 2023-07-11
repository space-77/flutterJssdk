import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import jssdk from './jssdk/index'

async function main() {
  try {
    const initTime = await jssdk.onReady()
    console.log('ready', initTime)
  } catch (error) {
    console.error(error)
  }
  createApp(App).mount('#app')
}

main()
