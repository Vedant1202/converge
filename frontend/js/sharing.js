//const popupButton = document.getElementById("popup-button");
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

document.addEventListener("DOMContentLoaded", function () {
    const collaborationButtons = document.querySelectorAll(".collaboration");
    collaborationButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Collaboration button clicked!");
          popupContainer.style.right = "50px";
        });
    });
});

closeButton.addEventListener("click", () => {
  popupContainer.style.right = "-400px"; 
});
