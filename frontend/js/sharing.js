
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

document.addEventListener("DOMContentLoaded", function () {
    const collaborationButton = [...document.querySelectorAll(".circular-button")].find(button => button.textContent === "🤝");
    if (collaborationButton) {
        collaborationButton.addEventListener("click", function () {
          popupContainer.style.right = "50px";
        });
    }
});

closeButton.addEventListener("click", () => {
  popupContainer.style.right = "-400px"; 
});
