const capturedNote = document.getElementById("writingArea");
capturedNote.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNoteToList();
        
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const notesButton = [...document.querySelectorAll(".circular-button")].find(button => button.textContent === "📝");
    if (notesButton) {
        notesButton.addEventListener("click", function () {
          toggleNotesWindow();
        });
    }
});

// prevents circle from being added when double clicking on note window
const noteWindow = document.getElementById("notesWindow");
noteWindow.addEventListener("dblclick", function(event) {
    event.stopPropagation();
})

function addNoteToList() {
    const capturedNote = document.getElementById("writingArea");
    const notesList = document.getElementById("notesList");
    const text = capturedNote.value.trim();
    if (text !== "") {
        const noteContainer = document.createElement("div"); // create container for note post format :{p, li}
        const nameField = document.createElement("p"); // create paragraph to hold user name
        const newNote = document.createElement("li"); // create list item to hold note contents

        const jsonData = localStorage.getItem("loginData"); // retreive saved login data from login screen
        const object = JSON.parse(jsonData); // parse through login data
        const userName = object.name; // set user name equal name field from login data

        // if there exists a username, set the namefield. Otherwise, user is Anonymous
        if (userName) {
            nameField.textContent = userName;
        }
        else {
            nameField.textContent =  "Anonymous";
        }

        newNote.textContent = text; // assign newNote list item with note contents
        
        // makes note editable upon click in text area
        newNote.addEventListener("click", function(event) {
            const listElement = event.target;
            listElement.contentEditable = "true";
            listElement.focus();
        })
        
        // disables note edit when clicking outside of note text area
        newNote.addEventListener("blur", function(event) {
            const listElement = event.target;
            listElement.contentEditable = "false";
            const nContainer = listElement.parentNode;
            if (listElement.textContent === "") {
                notesList.removeChild(nContainer); // deletes container of name and note if note edited to be empty
            }
        })

        // for consistency with creating note, edit disabled upon enter press
        newNote.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                const listElement = event.target;
                listElement.contentEditable = "false";
                const nContainer = listElement.parentNode;
                if (listElement.textContent === "") {
                    notesList.removeChild(nContainer); // deletes container of name and note if note edited to be empty
                }
            }
            
        })

        noteContainer.appendChild(nameField); // add user name to container
        noteContainer.appendChild(newNote); // add note contents to container
        notesList.appendChild(noteContainer); // insert user name and note into note list
        notesList.scrollTop = notesList.scrollHeight; // scroll to recently added note
        capturedNote.value = ""; // resets note writing text box
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