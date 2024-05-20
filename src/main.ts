import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n, setLanguage} from "./locales"

import './assety/styl.css'

const app = createApp(App)

app.use(i18n)
app.use(router)
let currLang = localStorage.getItem("lang") ?? (navigator.language != 'cs-CZ' | 0)
setLanguage(currLang)

app.mount('body')
