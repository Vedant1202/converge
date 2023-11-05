// shows/hides notes window
function toggleNotesWindow() {
    var noteWindowStatus = document.getElementById("notesWindow");
    if (noteWindowStatus.style.display === "none" || noteWindowStatus.style.display === "") { // check if notes not showing
        noteWindowStatus.style.display = "block"; // show notes
    }
    else { // notes showing
        noteWindowStatus.style.display = "none"; // hide notes
    }
}