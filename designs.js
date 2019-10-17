//Getting gird properties
let girdHeight = document.getElementById("gridHeight");
let girdWidth = document.getElementById("gridWidth");
//Getting cells properties
let cellHeight = document.getElementById("cellHeight");
let cellWidth = document.getElementById("cellWidth");
//The table or canvas
let pixelCanvas = document.getElementById("pixelCanvas"); 
//True means the action is active, if the pencil is false the earser is triggered 
//The earser is just painting but with the same color as the background is
let Pencil = true;
let painting = false;
let color;
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

    let innerHTMLValue = '';
    for(let row = 0; row < girdHeight.value; row++) {
        innerHTMLValue += '<tr>'
        for(let col = 0; col < girdWidth.value; col++)
        {
            innerHTMLValue += `<td width=${cellWidth.value} height=${cellHeight.value} class='tableData ${row + '' + col}'></td>`;
        }
        innerHTMLValue += '</tr>';  
    }

    pixelCanvas.innerHTML = innerHTMLValue;
    setEventListeners();
}

function undoChanges() {

}

function undoChanges() {

}

function resetGrid() {

}

function saveGrid() {

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
                tds[i].style.backgroundColor = color;
            }
        });

        tds[i].addEventListener('mousedown', ()=> {
            if(Pencil)
                color = document.getElementById('colorPicker').value;
            tds[i].style.backgroundColor = color;
        });
    }
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

addEventListener('mouseup', () => painting = false);

addEventListener("keydown", (event) => {
    if (event.keyCode === 80)
    {
        document.getElementById('pencil').style.backgroundColor = '#C0C04F';
        document.getElementById('eraser').style.backgroundColor = 'transparent';
        color = document.getElementById('colorPicker').value;
        Pencil = true;
    }

    else if(event.keyCode === 69)
    {
        document.getElementById('pencil').style.backgroundColor = 'transparent';
        document.getElementById('eraser').style.backgroundColor = '#C0C04F';
        color = 'white';
        console.log(color);
        Pencil = false;
    }

    else if(event.keyCode === 67)
    {
        document.getElementById('colorPicker').click();
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