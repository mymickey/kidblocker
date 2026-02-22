<template>
    <div class="p-5">
        <h2 class="text-base font-semibold text-gray-800 mb-4">{{ t('languageTitle') }}</h2>

        <div class="space-y-1.5">
            <button v-for="lang in languages" :key="lang.code" @click="switchLang(lang.code)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 text-left"
                :class="currentLang === lang.code
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'">
                <span class="text-lg">{{ lang.flag }}</span>
                <div class="flex-1">
                    <div class="text-sm font-medium">{{ lang.native }}</div>
                    <div class="text-xs" :class="currentLang === lang.code ? 'text-gray-300' : 'text-gray-400'">{{
                        lang.english }}</div>
                </div>
                <svg v-if="currentLang === lang.code" class="w-4 h-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { t, setLanguage, getCurrentLanguage } from '../i18n/index.js'

const currentLang = ref(getCurrentLanguage())

const languages = [
    { code: 'en', flag: '🇺🇸', native: 'English', english: 'English' },
    { code: 'zh', flag: '🇨🇳', native: '中文', english: 'Chinese' },
    { code: 'ja', flag: '🇯🇵', native: '日本語', english: 'Japanese' },
    { code: 'fr', flag: '🇫🇷', native: 'Français', english: 'French' },
    { code: 'es', flag: '🇪🇸', native: 'Español', english: 'Spanish' }
]

function switchLang(code) {
    setLanguage(code)
    currentLang.value = code
}
</script>
