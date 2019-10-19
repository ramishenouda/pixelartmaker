//N-ary Tree implementation to store all of the history 
class History {
    constructor(parent) {
        this.parent = parent;
        this.data = null;
        this.nodes = new Array();
    }
}

//Getting gird properties
let girdHeight = document.getElementById("gridHeight");
let girdWidth = document.getElementById("gridWidth");
let oldGridHeight = null;
let oldGridWidth = null;
//Getting cells properties
let cellHeight = document.getElementById("cellHeight");
let cellWidth = document.getElementById("cellWidth");
//The table or canvas
let pixelCanvas = document.getElementById("pixelCanvas");
//The area scontaning the RESET GRID and APPLY buttons 
let resetArea = document.getElementById("resetArea");
let applyArea = document.getElementById("applyArea");
//True means the action is active, if the pencil is false the earser is triggered 
//The earser is just painting but with the same color as the background is
let Pencil = true;
let painting = false;
let color;
//The head to the tree
let head = createHead();
//The recommended text
let recommended = document.getElementById("recommended"); 
//Title and menubar 
const title = document.getElementById("title");
const menuBar = document.getElementById("menuBar");
//Used to set the position of the table
let boardSize = {"width" : (window.innerWidth + menuBar.offsetWidth) / 2, "height" : (window.innerHeight + title.offsetHeight) / 2};
let CanvasSize;

//-----------------------Grid functions Region
function attemptToMakeGrid() {
    if(pixelCanvas.innerHTML == "")
    {
        makeGrid(girdHeight.value, girdWidth.value);
    }
    else 
        gridConfirmation();
}

function gridConfirmation() {
    applyArea.innerHTML = '<span style="color:red"/>Your work may conflict</span>' +
        `<input type="submit" class="confirmation" value="Confirm" onclick="makeGrid(${girdHeight.value}, ${girdWidth.value})">` +
        '<input type="button" value="Cancel" onclick="makeGridCancel()">';
}

function makeGridCancel() {
    applyArea.innerHTML = '<input type="submit" class="gridButtons" value="APPLY" onclick="attemptToMakeGrid()">';
}

function makeGrid(rows, cols, re = false, shift = true) {
    makeGridCancel();
    if(re == false)
        addCurrentChanges();
    
    elementsColors = head.data.elementsColors;

    let leftValue = boardSize.width - (cellWidth.value * girdWidth.value) / 2;
    let topValue = boardSize.height - (cellHeight.value * girdHeight.value) / 2;

    pixelCanvas.style.left = leftValue > 205 ? `${leftValue}px` : '205px';
    pixelCanvas.style.top = topValue > 50 ? `${topValue}px` : '50px';

    //TODO don't remove existing cells
    pixelCanvas.innerHTML = "";
    
    //or oldCellWidth
    if(oldGridHeight != null && shift == true) {
        
        let shiftY = parseInt((girdHeight.value - oldGridHeight) / 2);
        let shiftX = parseInt((girdWidth.value - oldGridWidth) / 2);
        
        if(shiftX != 0 || shiftY != 0) {
            for(let row = oldGridHeight - 1; row >= 0; row--) {
                for(let col = oldGridWidth - 1; col >= 0; col--) {
                    if(row + shiftX < 0 || col + shiftY < 0) {
                        continue;
                    }
                    
                    if(`${parseInt(row) + '' + parseInt(col)}` in elementsColors) {
                        elementsColors[`${(row + shiftY) + '' + (col + shiftX)}`] = elementsColors[`${parseInt(row) + '' + parseInt(col)}`];
                        delete elementsColors[`${row + '' + col}`];
                    }
                }
            }
        }

        head.data.elementsColors = elementsColors;
    }

    for(let row = 0; row < rows; row++) {
        let tr = document.createElement("tr");
        pixelCanvas.appendChild(tr);

        for(let col = 0; col < cols; col++)
        {
            let td = document.createElement("td")
            td.height = cellHeight.value;
            td.width = cellWidth.value;
            td.classList.add('tableData');
            td.classList.add(`${row + '' + col}`);
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

    oldGridHeight = parseInt(girdHeight.value);
    oldGridWidth = parseInt(girdWidth.value);

    setEventListeners();
    getCurrentChanges();
}

function setCanvasSize() {
    CanvasSize = {
        "width" : window.innerWidth - (menuBar.offsetWidth / 1.5),
        "height" : window.innerHeight + (title.offsetHeight / 1.5)
    };
}

function resetConfirmation() {
    resetArea.innerHTML = '<span style="color:red">current work will be lost</span>' + 
        '<input type="button" class="confirmation" value="CONFIRM" onclick="resetGridConfirm()">' +
        '<input type="button" value="CANCEL" onclick="resetGridCancel()">';
}

function resetGridCancel() {
    resetArea.innerHTML = '<input class="gridButtons resetGrid" type="button" value="RESET GRID" onclick="resetConfirmation()"> <br>';
}

function resetGridConfirm() {
    let tds = document.getElementsByClassName("tableData");
    for(let i = 0; i < tds.length; i++) {
        tds[i].style.backgroundColor = "";
    }

    makeGrid(0, 0);
    resetGridCancel();
}
//-----------------------Grid functions END Region

//-----------------------History functions Region
function createHead() {
    let Head = new History(null);
    
    let data = new Object();
    data["gridSize"] = { "height": 0, "width": 0 };
    data["cellSize"] = { "height": 0, "width": 0 };
    data["colorPicker"] = document.getElementById('colorPicker').value; 
    data["elementsColors"] = null;
    
    Head.data = data;
    return Head;
}

function addCurrentChanges() {
    if(getCurrentChanges() == head.data)
        return;

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
    currentChanges["gridSize"] = { "height": parseInt(girdHeight.value), "width": parseInt(girdWidth.value) };
    currentChanges["cellSize"] = { "height": parseInt(cellHeight.value), "width": parseInt(cellWidth.value) };
    currentChanges["colorPicker"] = document.getElementById('colorPicker').value; 
    currentChanges["elementsColors"] = new Object();

    for(let i = 0; i < tds.length; i++)
    {
        className = tds[i].classList[1];
        colorValue = tds[i].style.backgroundColor;
        if(colorValue == "")
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
    makeGrid(girdHeight.value, girdWidth.value, true, false);
}

function redoChanges() {
    
    if(head.nodes.length < 1)
        return;
    
    head = head.nodes[head.nodes.length - 1];    
    applySettings(head.data);
    makeGrid(girdHeight.value, girdWidth.value, true, false);
    
}

function applySettings(data) {
    girdHeight.value = data.gridSize.height;
    girdWidth.value = data.gridSize.width;

    cellHeight.value = data.cellSize.height;
    cellWidth.value = data.cellSize.width;

    document.getElementById('colorPicker').value = data.colorPicker;
}

//-----------------------History function END Region

function setRecommendedText () {
    setCanvasSize();
    let recommendedHeight = Math.floor(CanvasSize.height / cellHeight.value);
    let recommendedWidth = Math.floor(CanvasSize.width / cellWidth.value);
    document.getElementById("recommended").innerHTML = `Recommended grid ${recommendedHeight} x ${recommendedWidth}`;
}

function setEventListeners() {
    var tds = document.getElementsByClassName("tableData");
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

            resetGridCancel();
            makeGridCancel();
            painting = true;
            if(Pencil) {
                color = document.getElementById('colorPicker').value;
                tds[i].style.background = '';
            }

            tds[i].style.backgroundColor = color;
        });
    }
}

$("#menuBar").submit(function(e) {
    e.preventDefault();
});

cellHeight.addEventListener('input', setRecommendedText);
cellWidth.addEventListener('input', setRecommendedText);

addEventListener('mouseup', (e) => {
    if(painting == false || e.which != 1)
        return;

    addCurrentChanges();
    painting = false
});

addEventListener("keydown", (event) => {
    //P is down, triggernig the pencil
    if (event.keyCode === 80)
    {
        document.getElementById('pencil').style.backgroundColor = '#C0C04F';
        document.getElementById('eraser').style.backgroundColor = 'transparent';
        color = document.getElementById('colorPicker').value;
        Pencil = true;
    }

    //E is down, triggernig the eraser
    else if(event.keyCode === 69)
    {
        document.getElementById('pencil').style.backgroundColor = 'transparent';
        document.getElementById('eraser').style.backgroundColor = '#C0C04F';
        color = 'white';
        Pencil = false;
    }

    //E is down, triggernig the eraser
    else if(event.keyCode === 67)
    {
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
document.body.style.zoom = '90%';