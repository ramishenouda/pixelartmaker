//N-ary Tree implementation to store all of the history 
class History {
    constructor(parent) {
        this.parent = parent;
        this.data = null;
        this.nodes = new Array();
    }
}

//Getting canvas properties
let canvasHeight = document.getElementById("canvasHeight");
let canvasWidth = document.getElementById("canvasWidth");
let oldCanvasHeight = null;
let oldCanvasWidth = null;
let borderState = true;
//Getting cells properties
let cellHeight = document.getElementById('cellHeight');
let cellWidth = document.getElementById('cellWidth');
//The table or canvas
let pixelCanvas = document.getElementById('pixelCanvas');
//The area scontaning the RESET CANVAS and APPLY buttons 
let resetArea = document.getElementById('resetArea');
let applyArea = document.getElementById('applyArea');
//True means the action is active, if the pencil is false the earser is triggered 
//The earser is just painting but with the same color as the background is
let Pencil = true;
let painting = false;
let color;
//The head to the tree
let head = createHead();
//The recommended text
let recommended = document.getElementById('recommended'); 
//Title and menubar 
const title = document.getElementById('title');
const menuBar = document.getElementById('menuBar');
//Used to set the position of the table
let boardSize = {'width' : (window.innerWidth + menuBar.offsetWidth) / 2, 'height' : (window.innerHeight + title.offsetHeight) / 2};
let CanvasSize;

//-----------------------Canvas functions Region
function attemptToMakeCanvas() {
    if(pixelCanvas.innerHTML == "")
    {
        makeCanvas(canvasHeight.value, canvasWidth.value);
    }
    else 
        canvasConfirmation();
}

function canvasConfirmation() {
    resetCanvasCancel();
    applyArea.innerHTML =
        `<input type="submit" class="confirmation history-buttons" value="Confirm" onclick="makeCanvas(${canvasHeight.value}, ${canvasWidth.value})">` +
        '<input type="button" class="history-buttons" value="Cancel" onclick="makeCanvasCancel()">';
}

function makeCanvasCancel() {
    applyArea.innerHTML = '<input type="submit" class="canvas-buttons" value="APPLY" onclick="attemptToMakeCanvas()">';
}

function resetConfirmation() {
    makeCanvasCancel();
    resetArea.innerHTML = 
        '<input type="button" class="confirmation history-buttons" value="CONFIRM" onclick="resetCanvasConfirm()">' +
        '<input type="button" class="history-buttons" value="CANCEL" onclick="resetCanvasCancel()">';
}

function resetCanvasCancel() {
    resetArea.innerHTML = '<input class="canvas-buttons confirmation" type="button" value="RESET CANVAS" onclick="resetConfirmation()"> <br>';
}

function resetCanvasConfirm() {
    let tds = document.getElementsByClassName('tableData');
    for(let i = 0; i < tds.length; i++) {
        tds[i].style.backgroundColor = '';
    }

    makeCanvas(0, 0);
    resetCanvasCancel();
}

function makeCanvas(rows, cols, re = false, shift = true) {
    makeCanvasCancel();
    if(re == false)
        addCurrentChanges();
    
    elementsColors = head.data.elementsColors;

    let leftValue = boardSize.width - (cellWidth.value * canvasWidth.value) / 2;
    let topValue = boardSize.height - (cellHeight.value * canvasHeight.value) / 2;

    pixelCanvas.style.left = leftValue > parseInt(menuBar.offsetWidth) ? `${leftValue}px` : `${parseInt(menuBar.offsetWidth) + 5}px`;
    pixelCanvas.style.top = topValue > parseInt(title.offsetHeight) ? `${topValue}px` : `${title.offsetHeight + 5}px`;

    //TODO don't remove existing cells
    pixelCanvas.innerHTML = "";
    
    //or oldCellWidth
    if(oldCanvasHeight != null && shift == true) {
        
        let shiftY = parseInt((canvasHeight.value - oldCanvasHeight) / 2);
        let shiftX = parseInt((canvasWidth.value - oldCanvasWidth) / 2);
        
        if(shiftX != 0 || shiftY != 0) {
            for(let row = oldCanvasHeight - 1; row >= 0; row--) {
                for(let col = oldCanvasWidth - 1; col >= 0; col--) {
                    if(row + shiftX < 0 || col + shiftY < 0) {
                        continue;
                    }
                    
                    if(`${parseInt(row) + '_' + parseInt(col)}` in elementsColors) {
                        elementsColors[`${(row + shiftY) + '_' + (col + shiftX)}`] = elementsColors[`${parseInt(row) + '_' + parseInt(col)}`];
                        delete elementsColors[`${row + '_' + col}`];
                    }
                }
            }
        }

        head.data.elementsColors = elementsColors;
    }

    for(let row = 0; row < rows; row++) {
        let tr = document.createElement('tr');
        pixelCanvas.appendChild(tr);

        for(let col = 0; col < cols; col++)
        {
            let td = document.createElement('td')
            td.height = cellHeight.value;
            td.width = cellWidth.value;
            td.classList.add('tableData');
            td.classList.add(`${row + '_' + col}`);
            tr.appendChild(td);

            if(elementsColors != null) {
                if(td.classList[1] in elementsColors)
                {
                    td.style.backgroundColor = elementsColors[td.classList[1]];
                }

                else if(elementsColors.length < 0)
                    elementsColors = null;
            }
        }
    }

    oldCanvasHeight = parseInt(canvasHeight.value);
    oldCanvasWidth = parseInt(canvasWidth.value);
    
    triggerBorder(borderState);
    setEventListeners();
    getCurrentChanges();
}

function setCanvasSize() {
    CanvasSize = {
        'width' : window.innerWidth - (menuBar.offsetWidth / 1.5),
        'height' : window.innerHeight + (title.offsetHeight / 1.5)
    };
}

function triggerBorder(border = null) {
    if(border == null)
        border = !borderState;
    let tds = document.getElementsByTagName('td');
    if(border == true) {
        for(let i = 0; i < tds.length; i++) {
            tds[i].style.border = '1px solid #cab3b3';
        }
    }

    else
    {
        for(let i = 0; i < tds.length; i++) {
            tds[i].style.border = 'none';
        }
    }
    borderState = border;
}
//-----------------------Canvas functions END Region

//-----------------------History functions Region
function createHead() {
    let Head = new History(null);
    
    let data = new Object();
    data['canvasSize'] = { 'height': 0, 'width': 0 };
    data['cellSize'] = { 'height': 0, 'width': 0 };
    data["colorPicker"] = document.getElementById('colorPicker').value; 
    data["elementsColors"] = null;
    
    Head.data = data;
    return Head;
}

function addCurrentChanges() {
    head.nodes.push(new History(head));
    head = head.nodes[head.nodes.length - 1];
    head.data = getCurrentChanges();
    head.data.index = head.nodes.length - 1;
}

function getCurrentChanges() {
    let tds = document.getElementsByClassName("tableData");
    let currentChanges = new Object();
    let className, colorValue;

    //getting classname CHECKED
    //dictionary contains each className with the colorValue like this ClassName: Color
    currentChanges['canvasSize'] = { 'height': parseInt(canvasHeight.value), 'width': parseInt(canvasWidth.value) };
    currentChanges['cellSize'] = { 'height': parseInt(cellHeight.value), 'width': parseInt(cellWidth.value) };
    currentChanges['colorPicker'] = document.getElementById('colorPicker').value; 
    currentChanges['elementsColors'] = new Object();

    for(let i = 0; i < tds.length; i++)
    {
        className = tds[i].classList[1];
        colorValue = tds[i].style.backgroundColor;
        if(colorValue == '')
            continue;
        currentChanges.elementsColors[className] = colorValue;
    }

    return currentChanges;
}

function undoChanges() {
    if(head.parent == null)
        return;

    head = head.parent;    
    applySettings(head.data);
    makeCanvas(canvasHeight.value, canvasWidth.value, true, false);
}

function redoChanges() {
    
    if(head.nodes.length < 1)
        return;
    
    head = head.nodes[head.nodes.length - 1];    
    applySettings(head.data);
    makeCanvas(canvasHeight.value, canvasWidth.value, true, false);
    
}

function applySettings(data) {
    canvasHeight.value = data.canvasSize.height;
    canvasWidth.value = data.canvasSize.width;

    cellHeight.value = data.cellSize.height;
    cellWidth.value = data.cellSize.width;

    document.getElementById('colorPicker').value = data.colorPicker;
}

function showHistory() {
    
}
//-----------------------History function END Region

function setRecommendedText () {
    setCanvasSize();
    let recommendedHeight = Math.floor(CanvasSize.height / cellHeight.value);
    let recommendedWidth = Math.floor(CanvasSize.width / cellWidth.value);
    document.getElementById('recommended').innerHTML = `Recommended canvas ${recommendedHeight} x ${recommendedWidth}`;
    document.getElementById('recommended').style.left = menuBar.offsetWidth +'px';
}

function setEventListeners() {
    var tds = document.getElementsByClassName('tableData');
    for(let i = 0; i < tds.length; i++)
    {
        tds[i].addEventListener('mouseenter', ()=> {
            if(painting)
            {
                tds[i].style.background = "";
                tds[i].style.backgroundColor = color;
            }
        });

        tds[i].addEventListener('mousedown', (e)=> {
            if(e.which != 1)
                return;

            resetCanvasCancel();
            makeCanvasCancel();
            painting = true;
            if(Pencil) {
                color = document.getElementById('colorPicker').value;
                tds[i].style.background = '';
            }

            tds[i].style.backgroundColor = color;
        });
    }
}

$('#menuBar').submit(function(e) {
    e.preventDefault();
});

cellHeight.addEventListener('input', setRecommendedText);
cellWidth.addEventListener('input', setRecommendedText);

canvasHeight.addEventListener('input', () => {
    makeCanvasCancel();
    resetCanvasCancel();
});

canvasWidth.addEventListener('input', () => {
    makeCanvasCancel();
    resetCanvasCancel();
});

addEventListener('mouseup', (e) => {
    if(painting == false || e.which != 1)
        return;

    addCurrentChanges();
    painting = false
});

addEventListener('keydown', (event) => {
    //P is down, triggernig the pencil
    if (event.keyCode === 80)
    {
        resetCanvasCancel();
        makeCanvasCancel();
        document.getElementById('pencil').style.backgroundColor = '#C0C04F';
        document.getElementById('eraser').style.backgroundColor = 'transparent';
        color = document.getElementById('colorPicker').value;
        Pencil = true;
    }

    //E is down, triggernig the eraser
    else if(event.keyCode === 69)
    {
        resetCanvasCancel();
        makeCanvasCancel();
        document.getElementById('pencil').style.backgroundColor = 'transparent';
        document.getElementById('eraser').style.backgroundColor = '#C0C04F';
        color = 'white';
        Pencil = false;
    }

    //E is down, triggernig the eraser
    else if(event.keyCode === 67)
    {
        resetCanvasCancel();
        makeCanvasCancel();
        document.getElementById('colorPicker').click();
        //set the Pencil as the active tool
        document.getElementById('pencil').style.backgroundColor = '#C0C04F';
        document.getElementById('eraser').style.backgroundColor = 'transparent';
        color = document.getElementById('colorPicker').value;
        Pencil = true;
    }
});

document.getElementById('pencil').addEventListener('mousedown', () => {
    document.getElementById('pencil').style.backgroundColor = '#C0C04F';
    document.getElementById('eraser').style.backgroundColor = 'transparent';
    color = document.getElementById('colorPicker').value;
    Pencil = true;
});

document.getElementById('eraser').addEventListener('mousedown', () => {
    document.getElementById('pencil').style.backgroundColor = 'transparent';
    document.getElementById('eraser').style.backgroundColor = '#C0C04F';
    color = '#ffffff';
    Pencil = false;
});

document.getElementById('colorPicker').addEventListener('change', () => {
    addCurrentChanges();
});

setRecommendedText();
setCanvasSize();