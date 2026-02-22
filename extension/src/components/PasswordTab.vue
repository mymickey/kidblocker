<template>
  <div class="p-5">
    <h2 class="text-base font-semibold text-gray-800 mb-4">{{ t('passwordTitle') }}</h2>

    <!-- Description -->
    <div class="bg-gray-50 rounded-lg p-4 mb-5">
      <p class="text-sm text-gray-600 leading-relaxed">{{ t('passwordDesc') }}</p>
    </div>

    <!-- No password set -->
    <div v-if="!store.password" class="space-y-4">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        {{ t('noPasswordSet') }}
      </div>
      <div class="space-y-3">
        <input
          v-model="newPwd"
          type="password"
          :placeholder="t('newPassword')"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <input
          v-model="confirmPwd"
          type="password"
          :placeholder="t('confirmPassword')"
          @keyup.enter="setNewPassword"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        <button
          @click="setNewPassword"
          class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {{ t('setPassword') }}
        </button>
      </div>
    </div>

    <!-- Password already set -->
    <div v-else class="space-y-4">
      <div class="flex items-center gap-2 text-sm text-emerald-600 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <span class="font-medium">{{ t('passwordTitle') }}</span>
      </div>

      <!-- Change password -->
      <details class="group">
        <summary class="text-sm text-gray-600 cursor-pointer hover:text-gray-800 py-1">
          {{ t('changePassword') }}
        </summary>
        <div class="mt-3 space-y-3">
          <input
            v-model="currentPwd"
            type="password"
            :placeholder="t('currentPassword')"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            v-model="newPwd"
            type="password"
            :placeholder="t('newPassword')"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            v-model="confirmPwd"
            type="password"
            :placeholder="t('confirmPassword')"
            @keyup.enter="changePassword"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
          <button
            @click="changePassword"
            class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            {{ t('changePassword') }}
          </button>
        </div>
      </details>

      <!-- Remove password -->
      <details class="group">
        <summary class="text-sm text-red-500 cursor-pointer hover:text-red-600 py-1">
          {{ t('removePassword') }}
        </summary>
        <div class="mt-3 space-y-3">
          <input
            v-model="removePwd"
            type="password"
            :placeholder="t('currentPassword')"
            @keyup.enter="removePassword"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <p v-if="removeError" class="text-xs text-red-500">{{ removeError }}</p>
          <button
            @click="removePassword"
            class="w-full py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
          >
            {{ t('removePassword') }}
          </button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings.js'
import { t } from '../i18n/index.js'

const store = useSettingsStore()
const currentPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const removePwd = ref('')
const error = ref('')
const removeError = ref('')

function setNewPassword() {
  error.value = ''
  if (!newPwd.value) {
    error.value = t('passwordRequired')
    return
  }
  if (newPwd.value !== confirmPwd.value) {
    error.value = t('passwordMismatch')
    return
  }
  store.setPassword(newPwd.value)
  store.showToast(t('passwordSet'))
  newPwd.value = ''
  confirmPwd.value = ''
}

function changePassword() {
  error.value = ''
  if (currentPwd.value !== store.password) {
    error.value = t('passwordWrong')
    return
  }
  if (!newPwd.value) {
    error.value = t('passwordRequired')
    return
  }
  if (newPwd.value !== confirmPwd.value) {
    error.value = t('passwordMismatch')
    return
  }
  store.setPassword(newPwd.value)
  store.showToast(t('passwordChanged'))
  currentPwd.value = ''
  newPwd.value = ''
  confirmPwd.value = ''
}

function removePassword() {
  removeError.value = ''
  if (removePwd.value !== store.password) {
    removeError.value = t('passwordWrong')
    return
  }
  store.setPassword('')
  store.showToast(t('passwordRemoved'))
  removePwd.value = ''
}
</script>
