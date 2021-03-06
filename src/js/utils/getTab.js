const getTab = async (setTab, browser) => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0].url) {
        const url = new URL(tabs[0].url);
        setTab({
            url: `${url.origin}${url.pathname}`,
            origin: url.origin,
            index: tabs[0].index,
            id: tabs[0].id
        });
    }
};

export default getTab;