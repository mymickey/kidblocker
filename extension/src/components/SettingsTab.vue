<template>
  <div class="p-5 h-full flex flex-col">
    <h2 class="text-base font-semibold text-gray-800 mb-4">{{ t('settings') }}</h2>

    <!-- Mode toggle -->
    <div class="flex gap-2 mb-4">
      <label
        class="flex-1 flex items-center gap-2.5 px-3 py-2.5 border rounded-lg cursor-pointer transition-all duration-150"
        :class="selectedMode === 'blacklist'
          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
          : 'border-gray-200 hover:border-gray-300'"
      >
        <input
          type="radio"
          value="blacklist"
          :checked="selectedMode === 'blacklist'"
          @change="selectedMode = 'blacklist'"
          class="sr-only"
        />
        <span
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          :class="store.isModeActive('blacklist') ? 'border-emerald-500' : (selectedMode === 'blacklist' ? 'border-gray-900' : 'border-gray-300')"
        >
          <span v-if="store.isModeActive('blacklist')" class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span v-else-if="selectedMode === 'blacklist'" class="w-2 h-2 rounded-full bg-gray-900"></span>
        </span>
        <div>
          <div class="text-sm font-medium text-gray-800">{{ t('blacklistMode') }}</div>
          <div class="text-xs text-gray-500">{{ t('blacklistDesc') }}</div>
        </div>
      </label>

      <label
        class="flex-1 flex items-center gap-2.5 px-3 py-2.5 border rounded-lg cursor-pointer transition-all duration-150"
        :class="selectedMode === 'whitelist'
          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
          : 'border-gray-200 hover:border-gray-300'"
      >
        <input
          type="radio"
          value="whitelist"
          :checked="selectedMode === 'whitelist'"
          @change="selectedMode = 'whitelist'"
          class="sr-only"
        />
        <span
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          :class="store.isModeActive('whitelist') ? 'border-emerald-500' : (selectedMode === 'whitelist' ? 'border-gray-900' : 'border-gray-300')"
        >
          <span v-if="store.isModeActive('whitelist')" class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span v-else-if="selectedMode === 'whitelist'" class="w-2 h-2 rounded-full bg-gray-900"></span>
        </span>
        <div>
          <div class="text-sm font-medium text-gray-800">{{ t('whitelistMode') }}</div>
          <div class="text-xs text-gray-500">{{ t('whitelistDesc') }}</div>
        </div>
      </label>
    </div>

    <!-- Domain list -->
    <div class="flex-1 overflow-y-auto min-h-0 mb-3">
      <div class="space-y-1.5">
        <div
          v-for="(domain, idx) in currentList"
          :key="idx"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 group hover:bg-gray-100 transition-colors"
        >
          <img
            :src="'https://favicon.im/' + domain"
            :alt="domain"
            class="w-4 h-4 rounded flex-shrink-0"
            loading="lazy"
            onerror="this.style.display='none'"
          />
          <span v-if="editingIndex !== idx" class="flex-1 text-sm text-gray-700 truncate">
            {{ domain }}
          </span>
          <input
            v-else
            v-model="editValue"
            @keyup.enter="saveEdit(idx)"
            @keyup.escape="cancelEdit"
            class="flex-1 text-sm px-2 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <template v-if="editingIndex !== idx">
              <button
                @click="startEdit(idx, domain)"
                class="p-1 text-gray-400 hover:text-gray-600 rounded"
                :title="t('edit')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                </svg>
              </button>
              <button
                @click="removeDomain(domain)"
                class="p-1 text-gray-400 hover:text-red-500 rounded"
                :title="t('delete')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </template>
            <template v-else>
              <button
                @click="saveEdit(idx)"
                class="p-1 text-emerald-500 hover:text-emerald-600 rounded"
                :title="t('save')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
              <button
                @click="cancelEdit"
                class="p-1 text-gray-400 hover:text-gray-600 rounded"
                :title="t('cancel')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="currentList.length === 0" class="text-center py-8 text-sm text-gray-400">
        {{ t('addDomain') }}
      </div>
    </div>

    <!-- Add domain -->
    <div class="flex gap-2 mb-3">
      <input
        v-model="newDomain"
        @keyup.enter="addDomain"
        :placeholder="t('domainPlaceholder')"
        class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <button
        @click="addDomain"
        class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
      >
        {{ t('add') }}
      </button>
    </div>

    <!-- Sync notice -->
    <p class="text-xs text-gray-400 mb-3 leading-relaxed">
      {{ t('syncNotice') }}
    </p>

    <!-- Enable / Disable button -->
    <button
      @click="handleToggle"
      class="w-full py-2.5 text-sm font-medium rounded-lg transition-colors"
      :class="isCurrentModeActive
        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
        : 'bg-emerald-600 text-white hover:bg-emerald-700'"
    >
      {{ isCurrentModeActive ? t('disable') : t('enable') }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '../stores/settings.js'
import { t } from '../i18n/index.js'

const store = useSettingsStore()
const selectedMode = ref('blacklist')
const newDomain = ref('')
const editingIndex = ref(-1)
const editValue = ref('')

const isCurrentModeActive = computed(() => store.isModeActive(selectedMode.value))

const currentList = computed(() => {
  return store.getListForMode(selectedMode.value)
})

function addDomain() {
  const result = store.addDomain(selectedMode.value, newDomain.value)
  if (result.error) {
    store.showToast(t(result.error), 'error')
  } else {
    newDomain.value = ''
  }
}

function removeDomain(domain) {
  store.removeDomain(selectedMode.value, domain)
}

function startEdit(idx, domain) {
  editingIndex.value = idx
  editValue.value = domain
}

function saveEdit(idx) {
  const oldDomain = currentList.value[idx]
  const result = store.editDomain(selectedMode.value, oldDomain, editValue.value)
  if (result.error) {
    store.showToast(t(result.error), 'error')
  } else {
    editingIndex.value = -1
  }
}

function cancelEdit() {
  editingIndex.value = -1
  editValue.value = ''
}

function handleToggle() {
  if (isCurrentModeActive.value) {
    store.disableMode()
    store.showToast(t('disableSuccess'))
  } else {
    store.enableMode(selectedMode.value)
    store.showToast(t('enableSuccess'))
  }
}
</script>
