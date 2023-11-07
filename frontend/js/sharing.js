//const popupButton = document.getElementById("popup-button");
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

// popupButton.addEventListener("click", () => {
//   popupContainer.style.right = "50px"; 
// });


document.addEventListener("DOMContentLoaded", function () {
    const collaborationButtons = document.querySelectorAll(".collaboration");
    collaborationButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            // Your custom code for handling the "Collaboration" button click event
            console.log("Collaboration button clicked!");
          popupContainer.style.right = "50px";
            // Add your code here to open the collaboration menu or perform any desired action
        });
    });
});

closeButton.addEventListener("click", () => {
  popupContainer.style.right = "-400px"; 
});
