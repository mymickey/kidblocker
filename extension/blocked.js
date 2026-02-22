const params = new URLSearchParams(window.location.search)
const domain = params.get('domain') || 'this site'
document.getElementById('blocked-domain').textContent = domain + ' is blocked'
document.title = domain + ' is blocked - kidBlocker'
