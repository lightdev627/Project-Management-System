import { loadAccessToken, loadRequestDigest } from "./utils/axiosRequest.js";

try {
  await loadAccessToken();
  await loadRequestDigest();
} catch (err) {
  console.log(err)
  document.write(`<h1>😕 Ooops! <i style="font-size: 20px;">${err}</i></h1>`);
  window.stop();
}

import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/en-US'
import router from './routes/router.js'
import { createPinia } from 'pinia'
import {registerLicense} from '@syncfusion/ej2-base';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

// A few examples for animations from Animate.css:
import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import './assets/styles/css/styles.css'


import App from './App.vue'

createApp(App)
.use(createPinia())
.use(Quasar, {
  plugins: {
    Notify
  },
  lang: quasarLang,
})
.use(router)
.mount('#app')
registerLicense("ORg4AjUWIQA/Gnt3VVhhQlJDfVddXGBWfFN0QHNYf1R0c19HZEwgOX1dQl9mSXlSckRiWH9ed3FcQ2dXUkQ=")
