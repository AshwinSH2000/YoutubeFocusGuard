# Focus Guard: YouTube Intentionality Tool

Focus Guard is a lightweight Chrome Extension designed to break the cycle of mindless scrolling and unintentional content consumption on YouTube. By analysing video titles and search duration, it helps users stay aligned with their productivity goals.

## Features

**1. Smart Search Timer**: Prevents "Search Loop Procrastination." If you spend more than a set time (e.g., 15 minutes) on the search results page, the screen locks to encourage you to pick a video or get back to work.

**2. Video Title Analysis**: Monitors the title of the video you are currently watching. It communicates with a background script to determine if the content is educational/work-related or a distraction. (currently, educational/work-related content imply videos around tech and coding only; can always be changed)

**3. Automatic Enforcement**: When a distracting video is detected, Focus Guard automatically pauses the video and applies a full-screen focus overlay.

**4. Time-Restricted Access**: Hardcoded "Safe Zones" allow for entertainment only during specific hours (e.g., 11 PM - 1 AM).

**5. SPA Compatibility**: Built specifically for YouTube's Single Page Application (SPA) architecture using MutationObserver to track navigation without page refreshes.

## How It Works

**Observation**: A MutationObserver watches for URL changes (e.g., moving from Home to Search to a Video).

**Logic Branching**: If the URL contains "/results", a countdown timer starts. If the time crosses the preset maximum allowed value, then an overlay is displayed, which reminds the user to pick a video or close YouTube and get back to work.  If the URL contains "/watch", a recurring 3-second heartbeat or ping checks the video title.

**Communication**: The content script sends the title to the background script via `chrome.runtime.sendMessage`

**Intervention**: If the background script returns a BLOCK signal, the DOM is manipulated to pause the video and inject a high-priority CSS overlay. If the background does not return a BLOCK signal, it does nothing but checks the title again after 3 seconds. 

## Installation Instructions
Follow these steps to get Focus Guard running on your local machine.

1. Clone or Download the Code </br>
Via Git: `git clone https://github.com/your-username/focus-guard.git` </br>
Via Zip: Download the source code as a ZIP file and extract it to a folder on your laptop.

2. Load the Extension in Google Chrome </br>
Regardless of whether you are on Windows, macOS, or Linux, the process is the same:

Open Chrome and navigate to `chrome://extensions/`

In the top right corner, toggle Developer mode to ON.

Click the Load unpacked button that appears in the top left.

Select the folder where you saved/extracted the Focus Guard files.

The extension should now appear in your list and is immediately active!

3. To start the backend, open Terminal(Mac/Linux) or command prompt(Windows) and navigate to the `backend` folder inside the Focus Guard files. </br>
Then execute this command `uvicorn techDetector:app --reload` </br>
To confirm the successful start of the backend, you will get a message stating </br> `Uvicorn running on http://127.0.0.1:8000` and `Application startup complete.`

4. Now go to YouTube and click on any coding-related video, and it should play without any interruptions. </br> Next, choose a video having totally different topic say gardening. The video playback should get paused within 3000ms of being clicked with a message stating "This video looks non-educational for this time of day." </br> Thus, you are blocked from watching any non-tech video. So just get back to work! 

## ⚙️ Configuration
To adjust the "strictness" of the guard, you can modify the following variables in the `content.js` file:

RESULTS_TIME_LIMIT: Change this value (in milliseconds) to adjust how long you are allowed to browse search results.

Interval Timer: The 3000 (3 seconds) value in runYoutubeGuard can be increased to save CPU or decreased for faster blocking.

## 👨‍💻 Tech Stack
**Languages**: JavaScript (ES6+), HTML5, CSS3

**APIs**: Chrome Extension API (Runtime, Messaging, Storage)

**Techniques**: DOM Manipulation, MutationObserver, SPA Navigation Handling

## Current Intelligence & Future Roadmap
**Current State**: The system currently utilizes Vector Embeddings to classify video titles. By converting titles into numerical vectors, the extension can determine if a video is "Education-related" based on its semantic proximity to known tech/learning topics, rather than just relying on simple keyword matching.

**Next Step**: I am moving toward integrating Direct LLM API Calls (such as GPT-4o or Gemini). This will allow for a more nuanced, high-fidelity understanding of content, enabling the guard to distinguish between a "Tech News" video (entertainment) and a "Coding Tutorial" (work), providing much higher accuracy.

## 📜 License
This project is open-source and available under the MIT License.

If you have any suggestions or would like to make any improvements, Pull Requests are always welcome!
