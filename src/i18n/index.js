import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './en.js'
import ja from './ja.js'
import ru from './ru.js'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {en, ja, ru},
  numberFormats: {
    'en': {
      percent: {
        style: 'percent'
      }
    },
    'USD': {
      currency: {
        style: 'currency', currency: 'USD'
      },
    },
    'JPY': {
      currency: {
        style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
      },
    },
    'RUB': {
      currency: {
        style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'
      },
    }
  },
  dateTimeFormats: {
    'en': {
      short: {
        month: '2-digit', day: '2-digit'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    },
    'ja': {
      short: {
        month: '2-digit', day: '2-digit'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
      }
    },
    'ru': {
      short: {
        day: '2-digit', month: '2-digit'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    }
  }
})
