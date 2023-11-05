const capturedNote = document.getElementById("writingArea");
capturedNote.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNoteToList();
        
    }
});

function addNoteToList() {
    const capturedNote = document.getElementById("writingArea");
    const notesList = document.getElementById("notesList");
    const text = capturedNote.value.trim();
    if (text !== "") {
        const newNote = document.createElement("li");
        newNote.textContent = text;
        notesList.appendChild(newNote);
        notesList.scrollTop = notesList.scrollHeight;
        capturedNote.value = "";
    }
}

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