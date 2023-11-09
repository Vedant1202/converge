const optionsMenu = document.getElementById("optionsList");
const comArea = document.getElementById("commentArea");
const cpy = document.getElementById("copy");
const splt = document.getElementById("split");
const del = document.getElementById("delete");

optionsMenu.addEventListener("contextmenu", function(event) {
    event.preventDefault();
})

document.addEventListener("click", function(event) {
    if (event.target !== optionsMenu && event.target !== comArea && event.target !== cpy && event.target !== splt && event.target !== del) {
        optionsMenu.style.display = "none";
    }
})

comArea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        createAnnotation();
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
                            object.visible = 0;
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


function createAnnotation() {
    const text = comArea.value.trim();
    if (text !== "") {
        const jsonData = localStorage.getItem("loginData"); // retreive saved login data from login screen
        const object = JSON.parse(jsonData); // parse through login data
        const userName = object.name; // set user name equal name field from login data

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
            });
    
            
    
            var gp = new fabric.Group([ recBox, usrBox, comBox ]);
            
            currentGroup.addWithUpdate(gp);
            canvas.renderAll();
            
        }
    }
}