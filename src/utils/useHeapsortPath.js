import {
    nextTick, onUpdated
} from "vue"
import {
    newInstance,
    StraightConnector,
    BlankEndpoint,
    DotEndpoint
} from "@jsplumb/browser-ui"

const id = "container"

const drawLine = {
    container: null,
    el: () => document.getElementById(id)
}

const initLine=() => {
    drawLine.container = newInstance({
        container: drawLine.el()
    });
    // m = ct.connect({
    //     source: t[0],
    //     target: t[1],
    //     connector: StraightConnector.type,
    //     endpoint: {
    //         type: DotEndpoint.type,
    //         options: {
    //             radius: 2
    //         }
    //     },


    //     anchor: {
    //         type: "Perimeter",
    //         options: {
    //             shape: "Circle"
    //         }
    //     }
    // })
    // ct.setDraggable(t[0], false);
    // ct.setDraggable(t[1], false);
    console.log(drawLine.container)
}

function updateLine() {
    drawLine.container.deleteEveryConnection();
    createLine();

    
}

function removeAllLine(){
    drawLine.container.deleteEveryConnection();
}

function createLine() {
    let els = drawLine.el().getElementsByClassName("connect-node");
    
    // console.log(els);
    for (let i=0;i<els.length;i++) {
        i = parseInt(i, 10);
        // console.log(els[i])
        drawLine.container.setDraggable(els[i], false);
        if ((i + 1) * 2 <= els.length) {
            drawLine.container.connect({
                source: els[i],
                target: els[(i + 1) * 2 - 1],
                connector: StraightConnector.type,
                endpoint: {
                    type: DotEndpoint.type,
                    options: {
                        radius: 2
                    }
                },

                anchor: {
                    type: "Perimeter",
                    options: {
                        shape: "Circle"
                    }
                }
            })
        }
        if ((i + 1) * 2 + 1 <= els.length) {
            drawLine.container.connect({
                source: els[i],
                target: els[(i + 1) * 2],
                connector: StraightConnector.type,
                endpoint: {
                    type: DotEndpoint.type,
                    options: {
                        radius: 2
                    }
                },

                anchor: {
                    type: "Perimeter",
                    options: {
                        shape: "Circle"
                    }
                }
            })
        }
    }
}


export {
    updateLine,initLine,removeAllLine,createLine
};