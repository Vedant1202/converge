function toggleCreateMode() {
    isCreateMode = true;
    canvas.selection = false;
    isHeatmapMode = false;
    if (heatmapInstance) {
        heatmapInstance?.setData({data:[]});
        heatmapInstance = null;
        [...document.getElementsByClassName("heatmap-canvas")].forEach((e) =>
            e.remove()
        );
    }
}

function toggleHeatmapMode() {
    if (!isHeatmapMode) {
        isHeatmapMode = !isHeatmapMode;
        isCreateMode = false;
        instantiateHeatMap();
    } else {
        toggleCreateMode();
    }
}

function toggleSelectMode() {
    isCreateMode = false;
    canvas.selection = true;
    isHeatmapMode = false;
}

function createCircle(x, y, timestamp = Date.now(), radius = 100, emit = false, text = 'Topic') {
    if (eventReceived) {
        var circle = new fabric.Circle({
            left: x,
            top: y,
            fill: 'transparent',
            stroke: '.2rem black',
            radius: radius,
            id: 'c-' + timestamp,
          });
        var tbox = new fabric.Textbox(text, {
            left: circle.getCenterPoint().x,
            top: circle.getCenterPoint().y,
            width: 100,
            fontSize: '16',
            clipPath: circle,
            fill: 'black',
            fontcolor: 'black',
            id: 't-' + timestamp,
          });
        var group = new fabric.Group([ tbox, circle ], {
            id: 'g-' + timestamp
        })
        canvas.add(group).setActiveObject(circle);
        if (emit) {
            console.log('here', emit);
            socket.emit('event', JSON.stringify({
                type: 'create',
                object: 'circle',
                by: loginData.name,
                room: loginData.room,
                data: {
                    x: x,
                    y: y,
                    timestamp,
                    radius
                }
            }));
            console.log('event sent', {
                type: 'create',
                object: 'circle',
                by: loginData.name,
                room: loginData.room,
                data: {
                    x: x,
                    y: y
                }
            });
        }
        addToHeatmap(x, y, timestamp, radius);
    }
    // canvas.add(tbox);
    // event.stopPropagation();
}

function addToHeatmap(xCoord, yCoord, timestamp, radius) {
    heatmapData = {
        [timestamp] : {
            xCoord,
            yCoord,
            id: timestamp,
            radius
        },
        ...heatmapData,
    }
}

function instantiateHeatMap() {
    var dataPoints = [];
    var dataPoint
    Object.values(heatmapData).forEach(function ({ xCoord, yCoord }) {
        dataPoint = {
            x: xCoord,
            y: yCoord,
            value: 10,
            radius: 300,
            blur: 1
        };
        dataPoints.push(dataPoint);
    });
    
    heatmapInstance = h337.create({
        container: document.getElementById('canvas-div'),
        opacity: .2
    })
    heatmapInstance.addData(dataPoints);
}

function onObjectScaled(e) {
    var target = e.target
    var id = target.id;
    if (id.startsWith('t-')) return;
        var timestamp = Number(id.split('-')[1]);
        var text = target._objects[0].text;
        console.log('width', target.getScaledWidth());
        // var targetCircle = canvas.fabric.getItemByAttr('id', 'c-' + id);
    
        socket.emit('event', JSON.stringify({
            type: 'update',
            object: 'circle',
            by: loginData.name,
            room: loginData.room,
            data: {
                x: target.left,
                y: target.top,
                id: timestamp,
                radius: Math.floor(target.getScaledWidth() / 2),
                text: text,
            }
        }));
        console.log('updated', target, {
            type: 'update',
            object: 'circle',
            by: loginData.name,
            room: loginData.room,
            data: {
                x: target.left,
                y: target.top,
                id: timestamp,
                radius: Math.floor(target.width / 2),
                text: text,
            }
        })
}

function addCircleOnSocketEvent (eventData) {
    createCircle(eventData.x, eventData.y, eventData.timestamp, eventData.radius);
}

function getObjectFromCanvasById(id) {
    const canvasObject = canvas._objects.find((item) => {
        return item.id == id
    })
    return canvasObject
}

function removeObjectFromCanvasById(objectId) {
    const canvasObject = getObjectFromCanvasById(objectId);
    console.log('found object', canvasObject, objectId);
    canvas.remove(canvasObject);
}

function updateCircleOnSocketEvent (eventData) {
    var id = eventData.id
    console.log('data rec update', eventData, 'g-' + id);
    removeObjectFromCanvasById('g-' + id); // first remove object

    createCircle(eventData.x, eventData.y, eventData.id, eventData.radius, false, eventData.text);
    delete heatmapData[id]
    addToHeatmap(eventData.x, eventData.y, eventData.id, eventData.radius);
    
}

function updateTextOnSocketEvent (eventData) {
    console.log('called update');
    var id = eventData.id;
    var groupObj = getObjectFromCanvasById('g-' + id);
    var targetObj = groupObj._objects[0];
    targetObj.text = eventData.text;
}