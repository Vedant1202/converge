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
var startX, startY, endX, endY;

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
        stopContextMenu: true,
    });

    // $('body').dblclick(function (event) {
    //     var x = event.clientX;
    //     var y = event.clientY;
    //     createCircle(x, y, Date.now(), 100, true);
    //     event.stopPropagation();
    // });

    // $('body').on('mousedown', function (event) {
    //     console.log('heard', isCreateMode)
    //     if (isCreateMode && !canvas._activeObject) {
    //         startX = event.clientX;
    //         startY = event.clientY;
    //     }
    // })


    // $('body').on('mouseup', function (event) {
    //     if (isCreateMode && !canvas._activeObject) {
    //         endX = event.clientX;
    //         endY = event.clientY;

    //         var centerX = (endX - startX) / 2;
    //         var centerY = (endY - startY) / 2;
    //         var radius = Math.sqrt((endX - startX)**2 + (endY - startY)**2) / 2;
    //         console.log('coords', centerX, centerY, radius)
    //         createCircle(centerX, centerY, Date.now(), radius, true);
    //         event.stopPropagation();
    //     }
    // })

    var Circle = (function() {
        function Circle(canvas) {
          this.canvas = canvas;
          this.className = 'Circle';
          this.isDrawing = false;
          this.bindEvents();
        }
      
        Circle.prototype.bindEvents = function() {
          var inst = this;
          inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
          });
          inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
          });
          inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
          });
          inst.canvas.on('object:moving', function(o) {
            inst.disable();
          })
        }
      
        Circle.prototype.onMouseUp = function(o) {
            if (!isCreateMode) return;
            var inst = this;
            // var activeObj = inst.canvas.getActiveObject();
            // var pointer = inst.canvas.getPointer(o.e);
            var activeObj = inst.canvas.getActiveObject();
            var timestamp = activeObj.id.split('-')[1];
            var left = activeObj.getCenterPoint().x;
            var right = activeObj.getCenterPoint().y;
            var tbox = new fabric.Textbox('Topic', {
                left: Number(left),
                top: Number(top),
                width: 100,
                fontSize: '16',
                fill: 'black',
                fontcolor: 'black',
                id: 't-' + timestamp,
            });
            console.log('time', timestamp, left, right);
            if (getObjectFromCanvasById('t-' + timestamp)) {
                removeObjectFromCanvasById('t-' + timestamp)
            }
            if (getObjectFromCanvasById('c-' + timestamp)) {
                removeObjectFromCanvasById('c-' + timestamp)
            }
            if (getObjectFromCanvasById('g-' + timestamp)) {
                removeObjectFromCanvasById('g-' + timestamp)
            }
            inst.canvas.remove(activeObj)
            var group = new fabric.Group([ tbox, activeObj ], {
                id: 'g-' + timestamp
            })
            inst.canvas.add(group)
            inst.canvas.renderAll();
            inst.disable();
            socket.emit('event', JSON.stringify({
                type: 'create',
                object: 'circle',
                by: loginData.name,
                room: loginData.room,
                data: {
                    x: left - activeObj.radius,
                    y: top - activeObj.radius,
                    timestamp,
                    radius: activeObj.radius
                }
            }));
        };
      
        Circle.prototype.onMouseMove = function(o) {
          if (!isCreateMode) return;
          var inst = this;
          if (!inst.isEnable()) {
            return;
          }
      
          var pointer = inst.canvas.getPointer(o.e);
          var activeObj = inst.canvas.getActiveObject();
      
          activeObj.stroke = 'black',
            activeObj.strokeWidth = 5;
          activeObj.fill = 'transparent';
      
          if (origX > pointer.x) {
            activeObj.set({
              left: Math.abs(pointer.x)
            });
          }
      
          if (origY > pointer.y) {
            activeObj.set({
              top: Math.abs(pointer.y)
            });
          }
      
          activeObj.set({
            radius: Math.sqrt((origX - pointer.x)**2 + (origY - pointer.y)**2) / 2
          });
        //   activeObj.set({
        //     ry: Math.abs(origY - pointer.y) / 2
        //   });
          activeObj.setCoords();
          inst.canvas.renderAll();
        };
      
        Circle.prototype.onMouseDown = function(o) {
            // if (!isCreateMode) return;
          var inst = this;
          inst.enable();
        timestamp = Date.now();
      
          var pointer = inst.canvas.getPointer(o.e);
          origX = pointer.x;
          origY = pointer.y;
      
          var circle = new fabric.Circle({
            top: origY,
            left: origX,
            radius: 0,
            stroke: '.2rem black',
            transparentCorners: false,
            hasBorders: false,
            hasControls: false,
            id: 'c-' + timestamp,
          });
      
          inst.canvas.add(circle).setActiveObject(circle);
            // createCircle(origX, origY, Date.now(), 0, true);
        };
      
        Circle.prototype.isEnable = function() {
          return this.isDrawing;
        }
      
        Circle.prototype.enable = function() {
          this.isDrawing = true;
        }
      
        Circle.prototype.disable = function() {
          this.isDrawing = false;
        }
      
        return Circle;
      }());
      
      
      
      
    var circle = new Circle(canvas);

//     var circle, isDown, origX, origY;
// canvas.on('mouse:down', function(o){
//     if (isCreateMode) {isDown = true;
//     var pointer = canvas.getPointer(o.e);
//     origX = pointer.x;
//     origY = pointer.y;
//     circle = new fabric.Circle({
//         left: origX,
//         top: origY,
//         originX: 'left',
//         originY: 'top',
//         radius: pointer.x-origX,
//         angle: 0,
//         fill: '',
//         stroke:'red',
//         strokeWidth:3,
//     });
//     canvas.add(circle);}
// });
// canvas.on('mouse:move', function(o){
//     // if (!isCreateMode) return;
//     if (!isDown) return;
//     var pointer = canvas.getPointer(o.e);
//     var radius = Math.max(Math.abs(origY - pointer.y),Math.abs(origX - pointer.x))/2;
//     if (radius > circle.strokeWidth) {
//         radius -= circle.strokeWidth/2;
//     }
//     circle.set({ radius: radius});
//     if(origX>pointer.x){
//         circle.set({originX: 'right' });
//     } else {
//         circle.set({originX: 'left' });
//     }
//     if(origY>pointer.y){
//         circle.set({originY: 'bottom'  });
//     } else {
//         circle.set({originY: 'top'  });
//     }
//     canvas.renderAll();
// });
// canvas.on('mouse:up', function(o){
//   isDown = false;
// });

    optionsEvents();
    
    canvas.on('mouse:down', function(options) {
        console.log('here');
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
                        var newPoint = fabric.util.transformPoint({y: thisTarget.top, x: thisTarget.left}, matrix);
                        var objectPos = {
                            xStart: newPoint.x - (object.width * object.scaleX) / 2,//When OriginX and OriginY are centered, otherwise xStart: newpoint.x - object.width * object.scaleX etc...
                            xEnd: newPoint.x + (object.width * object.scaleX) / 2,
                            yStart: newPoint.y - (object.height * object.scaleY) / 2,
                            yEnd: newPoint.y + (object.height * object.scaleY) / 2
                        }
        
                        if ((mousePos.x >= (objectPos.xStart/2) && mousePos.x <= objectPos.xEnd) && (mousePos.y >= (objectPos.yStart/2) && mousePos.y <= objectPos.yEnd)) {
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

    $('#selectBtn').click(function (event) {
        toggleSelectMode();
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


