let resultsTimer = null;
let resultsStartTime = null;
let lastResultsUrl = null;
let videoCheckInterval = null; // var to chekc if back button is pressed or not

// const RESULTS_TIME_LIMIT = 15 * 60 * 1000; // 15 minutes
const RESULTS_TIME_LIMIT = 60 * 1000; // 60 seconds

let guardStarted = false;
let lastUrl = location.href;

const style = document.createElement("style");
style.textContent = `
#focus-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#focus-box {
  background: #111;
  color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  font-family: Arial, sans-serif;
}

#focus-box h2 {
  margin-bottom: 10px;
}
`;

function runYoutubeGuard() {
    //logic to catch and stop the exe of entire execution if screen doesnt have any video to be played.
    // if (!window.location.href.includes("watch")) {
    //     guardStarted = false;
    //     return;
    // }
    // if (guardStarted) return;
    // guardStarted = true;

    console.log(" Content script loaded on:", window.location.href);
    function getVideoTitle() {
        console.log("Content script loaded on YouTube");
        const titleElement = document.querySelector("h1.title yt-formatted-string");
        return titleElement ? titleElement.innerText : null;
    }
    let lastTitle = "";

    if (videoCheckInterval) clearInterval(videoCheckInterval);
    videoCheckInterval = setInterval(() => {
        // if (!title) return;

        // console.log("Content script loaded on YouTube ");

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
                    // alertUser(); //this is for simple alert message v1.0.2
                    showOverlay("This video looks non-educational for this time of day.");

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
        alert("Time-pass video detected. Allowed only between 11 PM and 1 AM.");
    }

    document.head.appendChild(style);

}

// let lastUrl = location.href;
// let guardStarted = false;

// function maybeRunGuard() {
//     if (!location.href.includes("watch")) {
//         guardStarted = false;
//         // return;
//     }

//     if (location.href.includes("hello")) {
//         showOverlay2("hi");
//         console.log("HIHIHIHIHIHIHIHIHIHIHIHIHIHIHIHIHIHI");
//     }

//     if (guardStarted) return;
//     guardStarted = true;

//     runYoutubeGuard();
// }
function maybeRunGuard() {

    removeOverlay();
    const url = location.href;

    // WATCH PAGE → existing logic
    if (url.includes("watch")) {
        resetResultsTimer();
        if (guardStarted) return;
        guardStarted = true;
        runYoutubeGuard();
        return;
    }

    //thiis is tocheck if the user has left the "watch" page and gone back.  
    if (videoCheckInterval) {
        clearInterval(videoCheckInterval);
        videoCheckInterval = null;
    }

    guardStarted = false; // Reset the gatekeeper

    // RESULTS PAGE → start tracking time
    if (url.includes("results")) {
        guardStarted = false;
        handleResultsPage();
        return;
    }

    // Any other page means reset everything
    guardStarted = false;
    resetResultsTimer();
}


maybeRunGuard(); // initial check

// SPA navigation watcher in the yt hompeage
// it fires anytime there has been a change in the html structure of the page. 
// until then adu muska haaki baabu maadtiratte. 
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(maybeRunGuard, 500);
        // this 500ms is a safety cushion.. as in SPA when you lcick a video, it is not 
        // refreshed. instead it just swaps the content. hence this cushion is to 
        // wait untiil the contents are properly swapped so that maybrRunGuard can 
        // read it accuratelu. 
    }
}).observe(document, { subtree: true, childList: true });


function handleResultsPage() {
    const currentUrl = location.href;

    // If this is a new results URL, reset timer
    if (lastResultsUrl !== currentUrl) {
        lastResultsUrl = currentUrl;
        resultsStartTime = Date.now();

        if (resultsTimer) {
            clearTimeout(resultsTimer);
        }

        resultsTimer = setTimeout(() => {
            showOverlay("You’ve been browsing search results for too long. Pick a video or get back to work.");
        }, RESULTS_TIME_LIMIT);

        console.log("Started results timer");

        document.head.appendChild(style);
    }
}

function resetResultsTimer() {
    if (resultsTimer) {
        clearTimeout(resultsTimer);
        resultsTimer = null;
    }
    resultsStartTime = null;
    lastResultsUrl = null;
}

function showOverlay(reasonText) {
    if (document.getElementById("focus-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "focus-overlay";

    overlay.innerHTML = `
    <div id="focus-box">
      <h2>Focus Guard</h2>
      <p>${reasonText}</p>
      <p><b>Allowed time:</b> 2:00 AM - 4:00 AM</p>
    </div>
  `;

    document.body.appendChild(overlay);
}

function removeOverlay() {
    const existingOverlay = document.getElementById("focus-overlay");
    if (existingOverlay) {
        existingOverlay.remove();
    }
}