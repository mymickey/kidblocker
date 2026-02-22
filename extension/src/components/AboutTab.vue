<template>
  <div class="p-5">
    <h2 class="text-base font-semibold text-gray-800 mb-4">{{ t('aboutTitle') }}</h2>

    <div class="space-y-5">
      <!-- App info -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="/icons/icon48.png" alt="kidBlocker" class="w-10 h-10" onerror="this.style.display='none'">
          <div>
            <div class="text-sm font-semibold text-gray-800">kidBlocker</div>
            <div class="text-xs text-gray-500">{{ t('version') }} 1.0.0</div>
          </div>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">{{ t('aboutDesc') }}</p>
      </div>

      <!-- Official website -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">{{ t('website') }}</h3>
        <a href="https://kidblocker.com?utm_source=ext" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm text-gray-900 hover:text-gray-600 font-medium transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          {{ t('visitWebsite') }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      <!-- Feedback -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">{{ t('feedback') || 'Feedback' }}</h3>
        <a href="https://github.com/mymickey/kidblocker/issues" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm text-gray-900 hover:text-gray-600 font-medium transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {{ t('reportIssue') || 'Report an Issue' }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '../i18n/index.js'
</script>
