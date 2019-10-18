//Getting gird properties
let girdHeight = document.getElementById("gridHeight");
let girdWidth = document.getElementById("gridWidth");
//Getting cells properties
let cellHeight = document.getElementById("cellHeight");
let cellWidth = document.getElementById("cellWidth");
//The table or canvas
let pixelCanvas = document.getElementById("pixelCanvas");
//The area contaning the RESET GRID button 
let resetArea = document.getElementById("resetArea");
//True means the action is active, if the pencil is false the earser is triggered 
//The earser is just painting but with the same color as the background is
let Pencil = true;
let painting = false;
let color;
//Tree structure for holding the history, TODO illustrate more
//The head
let history = new Object(); 
//dictionary holds current nodeMaster
let nodeMaster;
let lastNodeMaster = history;
//current branchIndex Number
let branchIndex = new Array();
//The recommended text
let recommended = document.getElementById("recommended"); 

const title = document.getElementById("title");
const menuBar = document.getElementById("menuBar");

let maxCanvasSize = {"width" : (window.innerWidth + menuBar.offsetWidth) / 2, "height" : (window.innerHeight + title.offsetHeight) / 2};
let CanvasSize;

function makeGrid() {
    let leftValue = maxCanvasSize.width - (cellWidth.value * girdWidth.value) / 2;
    let topValue = maxCanvasSize.height - (cellHeight.value * girdHeight.value) / 2;

    pixelCanvas.style.left = leftValue > 205 ? `${leftValue}px` : '205px';
    pixelCanvas.style.top = topValue > 50 ? `${topValue}px` : '50px';

    //TODO don't remove existing cells
    pixelCanvas.innerHTML = "";

    for(let row = 0; row < girdHeight.value; row++) {
        let tr = document.createElement("tr");
        pixelCanvas.appendChild(tr);

        for(let col = 0; col < girdWidth.value; col++)
        {
            let td = document.createElement("td")
            td.height = cellHeight.value;
            td.width = cellWidth.value;
            td.classList.add('tableData');
            td.classList.add(`${row + '' + col}`);
            tr.appendChild(td);
        }
    }
    setEventListeners();
    getCurrentChanges();
}

function undoChanges() {
    //back to start point
    if(nodeMaster == lastNodeMaster)
        return;
}

function redoChanges() {

}


function resetConfirmation()
{
    
    resetArea.innerHTML= '<input type="button" class="resetConfirmation" value="CONFIRM" onclick="resetGridConfirm()">' +
        '<input type="button" class="resetConfirmation" value="CANCEL" onclick="resetGridCancel()">';
}

function resetGridConfirm() {
    let tds = document.getElementsByClassName("tableData");
    for(let i = 0; i < tds.length; i++) {
        tds[i].style.backgroundColor = "";
    }

    resetGridCancel();
}

function resetGridCancel() {
    resetArea.innerHTML = '<input class="gridButtons resetGrid" type="button" value="RESET GRID" onclick="resetConfirmation()"> <br>';
}

document.body.style.zoom = '90%';

function setCanvasSize() {
    CanvasSize = {"width" : (window.innerWidth + 10 - menuBar.offsetWidth), "height" : (window.innerHeight - title.offsetHeight - 2)};
}

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

        tds[i].addEventListener('mousedown', ()=> {
            if(Pencil)
                color = document.getElementById('colorPicker').value;
                tds[i].style.background = '';
            tds[i].style.backgroundColor = color;
        });
    }
}

function setNodeMaster(node) {
    let counter = 0;
    for(item in history)
    {
        console.log(item);
        parent++;
        if(item === node)
        {
            console.log(item + ' ' + node);
            break;
        }
    }
    nodeMaster = node;
    parent = counter;
    child = 0;
}

function addCurrentChanges() {
    nodeMaster[parent+''+child++] = getCurrentChanges();
}

function getCurrentChanges() {
    let tds = document.getElementsByClassName("tableData");
    let move = new Object();
    let className, colorValue;

    //getting classname CHECKED
    //dictionary contains each className with the colorValue like this ClassName: Color
    for(let i = 0; i < tds.length; i++)
    {
        className = tds[i].classList[1];
        colorValue = tds[i].style.backgroundColor;
        move[className] = colorValue;
    }

    return move;
}


$("#menuBar").submit(function(e) {
    e.preventDefault();
});

setCanvasSize();

cellHeight.addEventListener('input', setRecommendedText);
cellWidth.addEventListener('input', setRecommendedText);

addEventListener('mousedown', () => {
    painting = true
});

addEventListener('mouseup', () => {
    painting = false
    addCurrentChanges();
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

document.getElementById('pencil').addEventListener('mousedown', () =>{
    document.getElementById('pencil').style.backgroundColor = '#C0C04F';
    document.getElementById('eraser').style.backgroundColor = 'transparent';
    color = document.getElementById('colorPicker').value;
    Pencil = true;
});

document.getElementById('eraser').addEventListener('mousedown', () =>{
    document.getElementById('pencil').style.backgroundColor = 'transparent';
    document.getElementById('eraser').style.backgroundColor = '#C0C04F';
    color = '#ffffff';
    Pencil = false;
});

setRecommendedText();
setNodeMaster(history);