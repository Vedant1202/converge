var isCreateMode;
var loginData;
var heatmapData = {};
var canvas;
var heatmapInstance;
var isHeatmapMode;
var socket;
var serverURL = 'http://localhost:3000';
var eventReceived;
var currentGroup;
var recBox, usrBox, comBox;

$(function () {
    isCreateMode = false;
    isHeatmapMode = false;
    if (!!window.localStorage.getItem('loginData')) { // check for login data
        loginData = JSON.parse(window.localStorage.getItem('loginData'));
    } else {
        alert('Invalid session! Click continue to redirect to login page')
        window.location = '/login';
    }

    document.getElementById('room-name').innerText = 'Room: ' + loginData.room

    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })

    canvas = new fabric.Canvas('canvas', {
        fireRightClick: true,
        stopContextMenu: true
    });

    $('body').dblclick(function (event) {
        var x = event.clientX;
        var y = event.clientY;
        createCircle(x, y, Date.now(), 100, true);
        event.stopPropagation();
    });

    optionsEvents();
    
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
                    if(object.type == 'textbox'){           
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
                                    if(groupItems[i] != 'textbox'){
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
                                    let id = "g-" + groupItems[0].id.split('-')[1]
                                    groupItems.forEach(function (obj) {
                                        items.push(obj);
                                        canvas.remove(obj);
                                    });
        
                                    var grp
                                    grp = new fabric.Group(items, {id});
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

    canvas.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });

    canvas.on('object:modified', onObjectScaled);

    canvas.on('object:moved', onObjectScaled);

    socket = io(serverURL);

    socket.on('event', (event) => {
        eventData = JSON.parse(event);
        eventReceived = true;
        console.log('event rec', eventData);
        if (eventData.room === loginData.room) {
            if (eventData.type === 'create' && eventData.object === 'circle') {
                addCircleOnSocketEvent(eventData.data);
            } else if (eventData.type === 'update' && eventData.object === 'circle') {
                updateCircleOnSocketEvent(eventData.data);
            } else if (eventData.type === 'create' && eventData.object === 'notes') {
                addNoteToList(eventData.data.text, eventData.by);
            } else if (eventData.type === 'create' && eventData.object === 'annotations') {
                createAnnotation(eventData.data.text, eventData.by, eventData.data.group);
            } else if (eventData.type === 'delete' && eventData.object === 'circle') {
                deleteCircle(eventData.data.group);
            }
        }
        eventReceived = false;
    });

    $('#heatmapBtn').click(function (event) {
        toggleHeatmapMode();
        event.stopPropagation();
    });

    $('#createnewBtn').click(function (event) {
        toggleCreateMode();
        event.stopPropagation();
    });

    var header = document.getElementById('toolbar');
    var btns = header.getElementsByClassName('toolbar-item');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
            var current = document.getElementsByClassName('toolbar-active');
            if (current && current[0]) {
                current[0].className = current[0].className.replace(' toolbar-active', '');
            }
            this.className += ' toolbar-active';
        });
    }
})


