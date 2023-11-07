function toggleCreateMode() {
    isCreateMode = !isCreateMode;
    isHeatmapMode = false;
    heatmapInstance?.setData({data:[]});
    heatmapInstance = {};
    [...document.getElementsByClassName("heatmap-canvas")].forEach((e) =>
        e.remove()
    );
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

function createCircle(x, y) {
    if (isCreateMode || eventReceived) {
        var circle = new fabric.Circle({
            left: x - 100,
            top: y - 150,
            fill: 'transparent',
            stroke: '.2rem black',
            radius: 100,
          });
        // canvas.add(circle);
        var tbox = new fabric.Textbox('Text on a path', {
            left: x - 45,
            top: y - 55,
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
        if (!eventReceived) {
            socket.emit('event', JSON.stringify({
                type: 'create',
                object: 'circle',
                by: loginData.name,
                room: loginData.room,
                data: {
                    x: x,
                    y: y
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
        addToHeatmap(x, y);
    }
    // canvas.add(tbox);
    // event.stopPropagation();
}

function addToHeatmap(xCoord, yCoord) {
    heatmapData = {
        [Date.now()] : {
            xCoord,
            yCoord
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