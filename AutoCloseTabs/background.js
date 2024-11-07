let waitTime = 5;
let keepRunning = false;
let firstTabId = null;

async function closeTabs() {
    const tabs = await browser.tabs.query({});
    for (let tab of tabs) {
        if (tab.id === firstTabId) continue;
        const isLoaded = tab.status === "complete";
        if (isLoaded) {
            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            await browser.tabs.remove(tab.id);
        }
        if (!keepRunning) {
            console.log("Stopping tab closure.");
            break;
        }
    }
}

async function startClosingTabs() {
    const result = await browser.storage.local.get("waitTime");
    waitTime = result.waitTime || 5;
    keepRunning = true;

    const tabs = await browser.tabs.query({});
    if (tabs.length > 0) {
        firstTabId = tabs[0].id;
    }

    while (keepRunning) {
        await closeTabs();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
        console.log(`Tab ${tabId} is fully loaded.`);
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        startClosingTabs();
    } else if (message.action === "stop") {
        keepRunning = false;
        console.log("Tab closure stopped.");
    }
});
