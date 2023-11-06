const popupButton = document.getElementById("popup-button");
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

popupButton.addEventListener("click", () => {
  popupContainer.style.right = "50px"; // Slide the pop-up in from the right
});

closeButton.addEventListener("click", () => {
  popupContainer.style.right = "-400px"; // Slide the pop-up out to the right
});
