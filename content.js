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
    },
        (response) => {
            if (response && response.action === "BLOCK") {
                pauseVideo();
                alertUser();
            }
        }
    );

    // }
}, 3000);

function pauseVideo() {
    const video = document.querySelector("video");
    if (video && !video.paused) {
        video.pause();
    }
}

function alertUser() {
    alert("🚫 Time-pass video detected. Allowed only between 11 PM and 1 AM.");
}
