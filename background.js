const educationalKeywords = [
    "dsa",
    "data structures",
    "algorithms",
    "algorithm",
    "computer science",
    "system design",
    "java",
    "python",
    "dbms",
    "operating systems",
    "computer networks",
    "development",
    "coding",
    "roadmap",
    "road map",
    "dbms",
    "os",
    "c++",
    "javascript",
    "java script",
    "full stack",
    "backend",
    "back end",
    "front end",
    "frontend",
    "fullstack",
    "web3",
    "web 3",
    "web3.0"
];

console.log("Background service worker started");


function isEducational(title) {

    if (title == '')
        return true;
    const lowerTitle = title.toLowerCase();
    return educationalKeywords.some(keyword => lowerTitle.includes(keyword));
}

function isAllowedTime() {
    const now = new Date();
    const hour = now.getHours();

    // Allowed between 23:00 and 01:00
    return hour >= 23 || hour <= 1;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // chrome.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message);
    // });

    if (message.type === "VIDEO_TITLE") {
        const title = message.title;

        if (!isEducational(title) && !isAllowedTime()) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/Yt.png",
                title: "Focus Alert 🚫",
                message: "This looks like a time-pass video. Allowed only after 11 PM."
            });

            chrome.tts.speak("Nope, Its Not Allowed, Ash. ", {
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0
            });
            sendResponse({ action: "BLOCK" });

        }
        else {
            sendResponse({ action: "ALLOW" })
        }
    }

    return true;
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or reloaded");
});

