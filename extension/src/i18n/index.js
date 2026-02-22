import en from './en.js'
import zh from './zh.js'
import ja from './ja.js'
import fr from './fr.js'
import es from './es.js'
import { ref } from 'vue'

const locales = { en, zh, ja, fr, es }

// Detect browser language
function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en'
    const short = lang.split('-')[0].toLowerCase()
    return locales[short] ? short : 'en'
}

const currentLang = ref(detectLanguage())

export function t(key) {
    const locale = locales[currentLang.value] || locales.en
    return locale[key] || locales.en[key] || key
}

export function setLanguage(lang) {
    if (locales[lang]) {
        currentLang.value = lang
    }
}

export function getCurrentLanguage() {
    return currentLang.value
}
