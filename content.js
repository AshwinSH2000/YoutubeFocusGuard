console.log("CONTENT SCRIPT LOADED");

function getVideoTitle() {
    console.log("Content script loaded on YouTube 1");
    const titleElement = document.querySelector("h1.title yt-formatted-string");
    return titleElement ? titleElement.innerText : null;

}

// Watch for page changes (YouTube is dynamic)
let lastTitle = "";

setInterval(() => {
    // console.log("Content script loaded on YouTube 2");

    const title = getVideoTitle();
    console.log("Detected Title:", title);

    // if (title && title !== lastTitle) {
    // lastTitle = title;

    chrome.runtime.sendMessage({
        type: "VIDEO_TITLE",
        title: title
    });

    // }
}, 3000);
