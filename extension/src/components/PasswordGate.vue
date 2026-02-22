<template>
  <div class="flex items-center justify-center h-[400px] bg-gray-50">
    <div class="w-72 text-center">
      <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ t('enterPassword') }}</h2>
      <p class="text-sm text-gray-500 mb-5">{{ t('passwordPrompt') }}</p>
      <div class="space-y-3">
        <input
          v-model="inputPassword"
          type="password"
          @keyup.enter="tryUnlock"
          :placeholder="t('password')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        <button
          @click="tryUnlock"
          class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {{ t('unlock') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings.js'
import { t } from '../i18n/index.js'

const emit = defineEmits(['unlocked'])
const store = useSettingsStore()
const inputPassword = ref('')
const error = ref('')

function tryUnlock() {
  if (inputPassword.value === store.password) {
    error.value = ''
    emit('unlocked')
  } else {
    error.value = t('passwordWrong')
  }
}
</script>
