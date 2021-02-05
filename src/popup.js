import browser from 'webextension-polyfill';
const HLX_PURGE_URL = 'https://adobeioruntime.net/api/v1/web/helix/helix-services/purge@v1';

let clearCache = document.getElementById('clear-cache');

const pagifyHelixLive = (host) => {
    const hosts = [ host ];
    if (host.includes('hlx.live')) {
        hosts.unshift(host.replace('hlx.live', 'hlx.page'));
    }
    return hosts;
}

const sendPurge = async (host, path) => {
    const url = new URL(HLX_PURGE_URL);
    const hosts = pagifyHelixLive(host);
    url.search = new URLSearchParams([
        ['host', hosts[0]],
        ['xfh', hosts.join(',')],
        ['path', path],
    ]).toString();
    const resp = await fetch(url, { method: 'POST' });
    const json = await resp.json();
    return {
        ok: resp.ok && Array.isArray(json) && json.every((e) => e.status === 'ok'),
        status: resp.status,
        json,
        path,
    }
};

const clicky = async () => {
    const tab = await browser.tabs.query({ active:true, currentWindow:true });
    const currentUrl = tab[0].url;

    const results = await browser.storage.sync.get('urls');
    results.urls.forEach(urlPair => {
        if (currentUrl.includes(urlPair.publicUrl)) {
            const helixedUrl = new URL(currentUrl.replace(urlPair.publicUrl, urlPair.helixUrl));
            const respProm = sendPurge(helixedUrl.host, helixedUrl.pathname);
            console.log(respProm);
            clearCache.innerHTML = 'Clearing...'
            respProm.then((resp) => {
                if (resp.ok) {
                    clearCache.innerHTML = 'Cleared!';
                }
            });
        }
    });
};

clearCache.onclick = clicky;