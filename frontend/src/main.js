import './index.css'
import Vue3Signature from "vue3-signature"

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)
app.use(Vue3Signature)
app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)
app.mount('#app')
