$(function () {
    var loginData;
    if (!!window.localStorage.getItem('loginData')) {
        loginData = JSON.parse(window.localStorage.getItem('loginData'));
    } else {
        alert('Invalid session! Click continue to redirect to login page')
        window.location = '../login/login.html'
    }

    var canvas = document.getElementById("canvas")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })

    var canvas = new fabric.Canvas('canvas');

    $('body').dblclick(function (event) {
        var circle = new fabric.Circle({
            left: event.clientX - 100,
            top: event.clientY - 150,
            fill: 'transparent',
            stroke: '.2rem black',
            radius: 100,
          });
        // canvas.add(circle);
        var tbox = new fabric.Textbox('Text on a path', {
            left: event.clientX - 45,
            top: event.clientY - 55,
            width: 100,
            fontSize: '16',
            clipPath: circle,
            fill: 'black',
            fontcolor: 'black',
          });
        var group = new fabric.Group([ tbox, circle ], {
            fill: 'green',
            stroke: 'red',
            
        })
        canvas.add(group);
        // canvas.add(tbox);
        event.stopPropagation();
    })

    canvas.on('mouse:down', function(options) {
        var groupItems;
        if (options.target) {
            var thisTarget = options.target; 
            var mousePos = canvas.getPointer(options.e);
            var editTextbox = false;
            var editObject;
        
            if (thisTarget.isType('group')) {
                var groupPos = {
                    x: thisTarget.left,
                    y: thisTarget.top
                }
        
                thisTarget.forEachObject(function(object,i) {
                    if(object.type == "textbox"){           
                        var matrix = thisTarget.calcTransformMatrix();
                        var newPoint = fabric.util.transformPoint({y: object.top, x: object.left}, matrix);
                        var objectPos = {
                            xStart: newPoint.x - (object.width * object.scaleX) / 2,//When OriginX and OriginY are centered, otherwise xStart: newpoint.x - object.width * object.scaleX etc...
                            xEnd: newPoint.x + (object.width * object.scaleX) / 2,
                            yStart: newPoint.y - (object.height * object.scaleY) / 2,
                            yEnd: newPoint.y + (object.height * object.scaleY) / 2
                        }
        
                        if ((mousePos.x >= objectPos.xStart && mousePos.x <= objectPos.xEnd) && (mousePos.y >= objectPos.yStart && mousePos.y <= objectPos.yEnd)) {
                            function ungroup (group) {
                                groupItems = group._objects;
                                group._restoreObjectsState();
                                canvas.remove(group);
                                for (var i = 0; i < groupItems.length; i++) {
                                    if(groupItems[i] != "textbox"){
                                        groupItems[i].selectable = false;
                                    }                               
                                    canvas.add(groupItems[i]);
                                }
                                canvas.renderAll();
                            }
        
                            ungroup(thisTarget);
                            canvas.setActiveObject(object);
        
                            object.enterEditing();
                            object.selectAll();
        
                            editObject = object;
                            var exitEditing = true;
        
                            editObject.on('editing:exited', function (options) {
                                if(exitEditing){
                                    var items = [];
                                    groupItems.forEach(function (obj) {
                                        items.push(obj);
                                        canvas.remove(obj);
                                    });
        
                                    var grp
                                    grp = new fabric.Group(items, {});
                                    canvas.add(grp);
                                    exitEditing = false;
                                }
                            });
                        }
                    }
                });
            }    
        }
    });
})