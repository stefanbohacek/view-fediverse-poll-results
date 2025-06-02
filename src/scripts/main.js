import onReady from "./modules/onReady.min.js";
import showError from "./modules/showError.min.js";

onReady(() => {
  const pollForm = document.getElementById("get-poll-results-form");
  const postUrlInput = document.getElementById("post-url-input");
  const viewResultsBtn = document.getElementById("view-results-btn");
  const showExampleBtn = document.getElementById("show-example");

  showExampleBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    postUrlInput.value = "https://stefanbohacek.online/@stefan/111284206579024132";
    viewResultsBtn.focus();
  });

  pollForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    viewResultsBtn.disabled = true;

    try {
      let url = postUrlInput.value;
      const urlParsed = new URL(url);

      const platformDataRequest = await fetch(
        `https://fediverse-info.stefanbohacek.com/node-info?domain=${urlParsed.host}`
      );

      const platformData = await platformDataRequest.json();
      const supportedPlatforms = ["mastodon"];

      if (supportedPlatforms.includes(platformData?.software?.name)) {
        window.location.href = `/poll?url=${encodeURIComponent(url)}`;
      } else {
        showError("not_supported");
      }
    } catch (err) {
      showError("general");
      console.log("poll_results_viewer_error:", err);
    }
    viewResultsBtn.disabled = false;
  });
});
