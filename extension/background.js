/* global chrome */

// Open settings page in a new tab when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dist/index.html') })
})

// Default blacklist domains
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

// Default whitelist domains
const DEFAULT_WHITELIST = [
    'pbskids.org',
    'kidoodle.tv',
    'bbc.co.uk',
    'nickjr.com',
    'netflix.com'
]

// chrome.storage.sync sometimes stores arrays as objects with numeric keys
function toArray(val) {
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') return Object.values(val)
    return null
}

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
    const data = await chrome.storage.sync.get(['activeMode', 'blacklist', 'whitelist'])

    const defaults = {}
    if (data.activeMode === undefined) defaults.activeMode = null
    if (!toArray(data.blacklist)) defaults.blacklist = DEFAULT_BLACKLIST
    if (!toArray(data.whitelist)) defaults.whitelist = DEFAULT_WHITELIST

    if (Object.keys(defaults).length > 0) {
        await chrome.storage.sync.set(defaults)
    }

    // Clean up old storage keys from previous version
    await chrome.storage.sync.remove(['mode', 'enabled'])
})

// Listen for messages from settings page to sync rules
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'updateRules') {
        updateBlockingRules().then(() => sendResponse({ success: true })).catch(e => {
            console.error('updateRules failed:', e)
            sendResponse({ success: false, error: e.message })
        })
        return true // keep channel open for async
    }
    if (message.action === 'getRules') {
        chrome.declarativeNetRequest.getDynamicRules().then(rules => {
            sendResponse({ rules })
        })
        return true
    }
})

// Also listen for storage changes to auto-update rules
chrome.storage.onChanged.addListener((_changes, namespace) => {
    if (namespace === 'sync') {
        updateBlockingRules()
    }
})

async function updateBlockingRules() {
    const data = await chrome.storage.sync.get(['activeMode', 'blacklist', 'whitelist'])
    const activeMode = data.activeMode || null
    const blacklist = toArray(data.blacklist) || []
    const whitelist = toArray(data.whitelist) || []

    console.log('[kidBlocker] Updating rules — activeMode:', activeMode, 'blacklist:', blacklist.length, 'whitelist:', whitelist.length)

    // First, remove all existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    const existingRuleIds = existingRules.map(r => r.id)

    if (existingRuleIds.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds
        })
    }

    // If no mode is active, done — no rules
    if (!activeMode) {
        console.log('[kidBlocker] No active mode, all rules cleared')
        return
    }

    const blockedPageUrl = chrome.runtime.getURL('blocked.html')
    const addRules = []
    let ruleId = 1

    if (activeMode === 'blacklist') {
        // Block each domain in the blacklist
        for (const domain of blacklist) {
            addRules.push({
                id: ruleId++,
                priority: 1,
                action: {
                    type: 'redirect',
                    redirect: { url: `${blockedPageUrl}?domain=${encodeURIComponent(domain)}` }
                },
                condition: {
                    urlFilter: `||${domain}`,
                    resourceTypes: ['main_frame']
                }
            })
        }
    } else if (activeMode === 'whitelist') {
        // Block everything first (low priority)
        addRules.push({
            id: ruleId++,
            priority: 1,
            action: {
                type: 'redirect',
                redirect: { url: `${blockedPageUrl}?domain=this-site` }
            },
            condition: {
                urlFilter: '*',
                resourceTypes: ['main_frame']
            }
        })

        // Allow whitelisted domains (higher priority)
        for (const domain of whitelist) {
            addRules.push({
                id: ruleId++,
                priority: 2,
                action: {
                    type: 'allow'
                },
                condition: {
                    urlFilter: `||${domain}`,
                    resourceTypes: ['main_frame']
                }
            })
        }

        // Always allow the extension's own pages
        addRules.push({
            id: ruleId++,
            priority: 3,
            action: { type: 'allow' },
            condition: {
                urlFilter: `${chrome.runtime.getURL('')}*`,
                resourceTypes: ['main_frame']
            }
        })

        // Always allow chrome:// and edge:// pages
        addRules.push({
            id: ruleId++,
            priority: 3,
            action: { type: 'allow' },
            condition: {
                urlFilter: 'chrome://*',
                resourceTypes: ['main_frame']
            }
        })

        addRules.push({
            id: ruleId++,
            priority: 3,
            action: { type: 'allow' },
            condition: {
                urlFilter: 'edge://*',
                resourceTypes: ['main_frame']
            }
        })
    }

    if (addRules.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({ addRules })
        console.log('[kidBlocker] Applied', addRules.length, 'rules for', activeMode, 'mode')
    }
}
