// draggable ribbon 
console.log('draggable-ribbon')

let startX = 0, startWidth;

function startDrag() {
    console.log('down')
    var panel = document.getElementById('layers');
    console.log(panel.offsetWidth)
    startWidth = panel.offsetWidth;
    panel.style.flex = 'none';
    panel.style.width = startWidth + 'px';
    console.log(startWidth)
    startX = event.clientX;
    glass.style = 'display: block;';
    glass.addEventListener('mousemove', drag, false);
}

function endDrag() {
    console.log('up')
    glass.removeEventListener('mousemove', drag, false);
    glass.style = '';
}

function drag(event) {
    console.log('drag')
    var splitter = getSplitter();
    var panel = document.getElementById('layers');
    var delta = event.clientX - startX;
    // panel.style.width = (currentWidth - (event.clientX - currentLeft)) + "px";
    panel.style.width = (startWidth - delta) + "px";
    console.log(panel.style.width)
}

function getSplitter() {
    return document.getElementById('ribbon');
}

var con = document.getElementById('main');
var splitter = document.getElementById('ribbon');
var glass = document.getElementById('glass');
splitter.addEventListener('mousedown', startDrag, false);
glass.addEventListener('mouseup', endDrag, false);
