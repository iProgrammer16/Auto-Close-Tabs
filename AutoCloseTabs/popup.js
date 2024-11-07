document.addEventListener("DOMContentLoaded", async () => {
    const result = await browser.storage.local.get("waitTime");
    const savedWaitTime = result.waitTime || 5;
    document.getElementById("waitTime").value = savedWaitTime;
});

document.getElementById("startButton").addEventListener("click", async () => {
    const waitTime = document.getElementById("waitTime").value;
    if (waitTime && waitTime > 0) {
        await browser.storage.local.set({ waitTime: parseInt(waitTime) });
        browser.runtime.sendMessage({ action: "start" });
    } else {
        alert("Please enter a valid time greater than 0.");
    }
});

document.getElementById("stopButton").addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "stop" });
});
