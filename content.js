//logic to catch and stop the exe of entire execution if screen doesnt have any video to be played.
if (!window.location.href.includes("watch")) {
    return;
}

function getVideoTitle() {
    console.log("Content script loaded on YouTube");
    const titleElement = document.querySelector("h1.title yt-formatted-string");
    return titleElement ? titleElement.innerText : null;
}

let lastTitle = "";

setInterval(() => {
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

function showOverlay(reasonText) {
    if (document.getElementById("focus-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "focus-overlay";

    overlay.innerHTML = `
    <div id="focus-box">
      <h2>Focus Guard</h2>
      <p>${reasonText}</p>
      <p><b>Allowed time:</b> 11:00 PM - 1:00 AM</p>
    </div>
  `;

    document.body.appendChild(overlay);
}
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
document.head.appendChild(style);
