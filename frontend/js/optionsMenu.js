const optionsMenu = document.getElementById("optionsList");
const comArea = document.getElementById("commentArea");
const merge = document.getElementById("merge");
const splt = document.getElementById("split");
const del = document.getElementById("delete");

optionsMenu.addEventListener("contextmenu", function(event) {
    event.preventDefault();
})

document.addEventListener("click", function(event) {
    if (event.target !== optionsMenu && event.target !== comArea && event.target !== merge && event.target !== splt && event.target !== del) {
        optionsMenu.style.display = "none";
    }
})

comArea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        createAnnotation(null, null, null, true);
        optionsMenu.style.display = "none";
    }
});

function optionsEvents() {
    canvas.on('mouse:over', function (event) {
        if (event.target) {
            var tgt = event.target;
            if (tgt.isType('group')) {
                tgt.forEachObject(function(object,i) {
                    if (object.type == 'group') {
                        var annotBox = object;
                        tgt.removeWithUpdate(object);
                        annotBox.forEachObject(function(object,j) {
                            object.visible = 1;
                            object.opacity = 1;
                            
                        });
                        tgt.addWithUpdate(annotBox);
                    }
                });
            }
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:out', function (event) {
        if (event.target) {
            var tgt = event.target;
            if (tgt.isType('group')) {
                tgt.forEachObject(function(object,i) {
                    if (object.type == 'group') {
                        var annotBox = object;
                        tgt.removeWithUpdate(object);
                        annotBox.forEachObject(function(object,j) {
                            object.visible = 1;
                            object.opacity = 0.05;
                        });
                        tgt.addWithUpdate(annotBox);
                    }
                });
            }
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:down', function(event) {
        if (event.button === 3 && event.target && event.target.isType('group')) {
            const optionsMenu = document.getElementById("optionsList");
            optionsMenu.style.display = "block";
            optionsMenu.style.left = event.e.clientX + "px";
            optionsMenu.style.top = (event.e.clientY - optionsMenu.clientHeight) + "px";
            currentGroup = event.target;  
        }
    })
}

function circleAnnotated(g) {
    var annotated = false;
    if (g.isType('group')) {
        g.forEachObject(function(object, i) {
            if (object.type == 'group') {
                annotated = true;
            }
        });
    }
    return annotated;
}

function deleteCircle(incomingGroup = false, emit = false) {
    console.log("Delete toggled");
    if (incomingGroup) {
        canvas.forEachObject(function (obj) {
            if (obj.type === 'group' && obj.id === incomingGroup) {
                currentGroup = obj;
                return;
            }
        });
    }
    canvas.remove(currentGroup);
    optionsMenu.style.display = "none";
    if (emit) {
        socket.emit('event', JSON.stringify({
            type: 'delete',
            object: 'circle',
            by: loginData.name,
            room: loginData.room,
            data: {
                group: currentGroup.id,
            }
        }));
    }
}

function mergeCircle() {
    console.log("Merge toggled");
}

function splitCircle() {
    console.log("Split toggled");
}

function createAnnotation(incomingText = null, incomingName = null, incomingGroup = false, emit = false) {
    let text;
    if (incomingText) {
        text = incomingText;
    } else {
        text = comArea.value.trim();
    }
    if (incomingGroup) {
        canvas.forEachObject(function (obj) {
            if (obj.type === 'group' && obj.id === incomingGroup) {
                currentGroup = obj;
                return;
            }
        });
    }
    if (text !== "") {
        const jsonData = localStorage.getItem("loginData"); // retreive saved login data from login screen
        const object = JSON.parse(jsonData); // parse through login data
    
        let userName;
        if (incomingName) {
            userName = incomingName;
        } else {
            userName = object.name; // set user name equal name field from login data
        }

        comArea.value = ""; // resets note writing text box
        var commentPresent = false;
        currentGroup.forEachObject(function(object,i) {
            if (object.isType('group')) {
                commentPresent = true;
            }
        });
        if (commentPresent === false) {
            var recBox = new fabric.Rect({
                left: currentGroup.get('left') + 200,
                top: currentGroup.get('top'),
                originX: 'center',
                originY: 'center',
                width: 150,
                height: 150,
                fill: 'white',
                visible: 1,
                stroke: 'black',
                strokeWidth: 2,
                opacity: 0.05,
    
            });
    
            var usrBox = new fabric.Textbox(userName, {
                left: currentGroup.get('left') + 190,
                top: currentGroup.get('top') - 50,
                originX: 'center',
                originY: 'center',
                width: 100,
                fontStyle: 'italic',
                fontSize: '16',
                fill: 'darkgray',
                visible: 1,
                opacity: 0.05,
            });
    
            var comBox = new fabric.Textbox(text, {
                left: currentGroup.get('left') + 190,
                top: currentGroup.get('top') - 20,
                originX: 'center',
                originY: 'center',
                width: 100,
                fontSize: '16',
                fill: 'black',
                visible: 1,
                opacity: 0.05,
            });
    
            
    
            var gp = new fabric.Group([ recBox, usrBox, comBox ], {
                id: currentGroup.id
            });
            
            currentGroup.addWithUpdate(gp);
            canvas.renderAll();
            
        }
    }
    if (emit) {
        socket.emit('event', JSON.stringify({
            type: 'create',
            object: 'annotations',
            by: loginData.name,
            room: loginData.room,
            data: {
                text: text,
                group: currentGroup.id,
            }
        }));
    }
}