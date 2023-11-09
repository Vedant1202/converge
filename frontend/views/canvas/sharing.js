
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");

// document.addEventListener("DOMContentLoaded", function () {
//   const collaborationButton = document.getElementById('collaborationBtn');
//   if (collaborationButton) {
//       collaborationButton.addEventListener("click", function () {
//           popupContainer.style.right = "50px";
//       });
//   }
// });

$('#collaborationBtn').click(function () {
  if (popupContainer.style.display === 'none' || popupContainer.style.display === '') {
    popupContainer.style.display = 'block';
  } else {
      popupContainer.style.display = 'none';
    }
})

closeButton.addEventListener("click", () => {
    popupContainer.style.display = 'none';
});
