<template>
  <div class="flex flex-col w-[50vw] h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden">
    <!-- Toast notification -->
    <Transition name="toast">
      <div
        v-if="store.toast.show"
        class="fixed top-3 right-3 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white"
        :class="store.toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
      >
        {{ store.toast.message }}
      </div>
    </Transition>

    <!-- Password gate -->
    <PasswordGate v-if="needsPassword && !unlocked" @unlocked="unlocked = true" />

    <!-- Main panel -->
    <div v-else class="flex flex-1 overflow-hidden">
      <!-- Left sidebar -->
      <nav class="w-[150px] bg-gray-50 border-r border-gray-200 flex flex-col">
        <div class="px-4 py-4 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <img src="/icons/icon32.png" alt="kidBlocker" class="w-6 h-6" onerror="this.style.display='none'">
            <span class="text-sm font-semibold text-gray-800">kidBlocker</span>
          </div>
        </div>
        <div class="flex-1 py-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150"
            :class="activeTab === tab.id
              ? 'bg-white text-gray-900 font-medium border-r-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
        <!-- Status indicator -->
        <div class="px-4 py-3 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="store.activeMode ? 'bg-emerald-400' : 'bg-gray-300'"
            ></span>
            <span class="text-xs text-gray-500">
              {{ store.activeMode ? t('enabled') : t('disabled') }}
            </span>
          </div>
        </div>
      </nav>

      <!-- Right content -->
      <main class="flex-1 overflow-y-auto">
        <SettingsTab v-if="activeTab === 'settings'" />
        <PasswordTab v-else-if="activeTab === 'password'" />
        <AboutTab v-else-if="activeTab === 'about'" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useSettingsStore } from './stores/settings.js'
import { t } from './i18n/index.js'
import PasswordGate from './components/PasswordGate.vue'
import SettingsTab from './components/SettingsTab.vue'
import PasswordTab from './components/PasswordTab.vue'
import AboutTab from './components/AboutTab.vue'

const store = useSettingsStore()
const activeTab = ref('settings')
const unlocked = ref(false)

const needsPassword = computed(() => !!store.password)

// SVG icon components
const SettingsIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' })
    ])
  }
}

const PasswordIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z' })
    ])
  }
}

const AboutIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' })
    ])
  }
}

const tabs = computed(() => [
  { id: 'settings', label: t('settings'), icon: SettingsIcon },
  { id: 'password', label: t('password'), icon: PasswordIcon },
  { id: 'about', label: t('about'), icon: AboutIcon }
])

onMounted(() => {
  store.loadSettings()
})
</script>

<style>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
