/* global chrome */
import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_BLACKLIST = [
    'youtube.com',
    'bilibili.com',
    'niconico.jp',
    'rutube.ru',
    'vk.com',
    'tv.naver.com',
    'tv.kakao.com',
    'vimeo.com',
    'hotstar.com',
    'jiocinema.com',
    'tiktok.com'
]

const DEFAULT_WHITELIST = [
    'pbskids.org',
    'kidoodle.tv',
    'bbc.co.uk',
    'nickjr.com',
    'netflix.com'
]

// chrome.storage.sync sometimes stores arrays as objects with numeric keys
// This helper converts them back to arrays
function toArray(val) {
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') return Object.values(val)
    return null
}

export const useSettingsStore = defineStore('settings', () => {
    // activeMode: null (nothing active), 'blacklist', or 'whitelist'
    const activeMode = ref(null)
    const blacklist = ref([...DEFAULT_BLACKLIST])
    const whitelist = ref([...DEFAULT_WHITELIST])
    const password = ref('')
    const loaded = ref(false)
    const toast = ref({ show: false, message: '', type: 'success' })

    // Load settings from chrome.storage.sync
    async function loadSettings() {
        try {
            const data = await chrome.storage.sync.get(['activeMode', 'blacklist', 'whitelist', 'password'])
            console.log('[kidBlocker] loadSettings:', JSON.stringify(data))
            if (data.activeMode !== undefined) activeMode.value = data.activeMode
            const bl = toArray(data.blacklist)
            const wl = toArray(data.whitelist)
            if (bl) blacklist.value = bl
            if (wl) whitelist.value = wl
            if (data.password) password.value = data.password
        } catch (e) {
            console.error('[kidBlocker] loadSettings error:', e)
        }
        loaded.value = true
    }

    // Save settings to chrome.storage.sync
    async function saveSettings() {
        try {
            const payload = {
                activeMode: activeMode.value,
                blacklist: blacklist.value,
                whitelist: whitelist.value,
                password: password.value
            }
            console.log('[kidBlocker] saveSettings:', JSON.stringify(payload))
            await chrome.storage.sync.set(payload)
            console.log('[kidBlocker] saveSettings success')
            // Notify background to update rules
            chrome.runtime.sendMessage({ action: 'updateRules' })
        } catch (e) {
            console.error('[kidBlocker] saveSettings error:', e)
        }
    }

    function enableMode(mode) {
        activeMode.value = mode
        saveSettings()
    }

    function disableMode() {
        activeMode.value = null
        saveSettings()
    }

    function isModeActive(mode) {
        return activeMode.value === mode
    }

    function getListForMode(mode) {
        return mode === 'blacklist' ? blacklist.value : whitelist.value
    }

    function isValidDomain(domain) {
        return /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(domain)
    }

    function addDomain(mode, domain) {
        const list = mode === 'blacklist' ? blacklist : whitelist
        const clean = domain.trim().toLowerCase()
        if (!clean || !isValidDomain(clean)) return { error: 'invalidDomain' }
        if (list.value.includes(clean)) return { error: 'duplicateDomain' }
        list.value.push(clean)
        saveSettings()
        return { success: true }
    }

    function removeDomain(mode, domain) {
        const list = mode === 'blacklist' ? blacklist : whitelist
        const idx = list.value.indexOf(domain)
        if (idx > -1) {
            list.value.splice(idx, 1)
            saveSettings()
        }
    }

    function editDomain(mode, oldDomain, newDomain) {
        const list = mode === 'blacklist' ? blacklist : whitelist
        const clean = newDomain.trim().toLowerCase()
        if (!clean || !isValidDomain(clean)) return { error: 'invalidDomain' }
        if (clean !== oldDomain && list.value.includes(clean)) return { error: 'duplicateDomain' }
        const idx = list.value.indexOf(oldDomain)
        if (idx > -1) {
            list.value[idx] = clean
            saveSettings()
        }
        return { success: true }
    }

    function setPassword(pwd) {
        password.value = pwd
        saveSettings()
    }

    function showToast(message, type = 'success') {
        toast.value = { show: true, message, type }
        setTimeout(() => {
            toast.value.show = false
        }, 2500)
    }

    return {
        activeMode,
        blacklist,
        whitelist,
        password,
        loaded,
        toast,
        loadSettings,
        saveSettings,
        enableMode,
        disableMode,
        isModeActive,
        getListForMode,
        addDomain,
        removeDomain,
        editDomain,
        setPassword,
        showToast
    }
})
