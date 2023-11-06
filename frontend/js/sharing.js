//const popupButton = document.getElementById("popup-button");
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

// popupButton.addEventListener("click", () => {
//   popupContainer.style.right = "50px"; 
// });

closeButton.addEventListener("click", () => {
  popupContainer.style.right = "-400px"; 
});
