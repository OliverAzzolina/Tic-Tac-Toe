let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

function init() {
    render();
}

function generateAnimatedCircle() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "35");
    circle.setAttribute("cy", "35");
    circle.setAttribute("r", "30");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", "#00B0EF");
    circle.setAttribute("stroke-width", "5");

    const animation = document.createElementNS(svgNS, "animate");
    animation.setAttribute("attributeName", "r");
    animation.setAttribute("from", "10");
    animation.setAttribute("to", "30");
    animation.setAttribute("dur", "0.1s");
    animation.setAttribute("begin", "0s");
    animation.setAttribute("fill", "freeze");

    circle.appendChild(animation);
    svg.appendChild(circle);

    return svg.outerHTML;
}

function generateAnimatedCross() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    const line1 = document.createElementNS(svgNS, "line");
    line1.setAttribute("x1", "10");
    line1.setAttribute("y1", "10");
    line1.setAttribute("x2", "60");
    line1.setAttribute("y2", "60");
    line1.setAttribute("stroke", "#FFC00");
    line1.setAttribute("stroke-width", "5");

    const line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", "60");
    line2.setAttribute("y1", "10");
    line2.setAttribute("x2", "10");
    line2.setAttribute("y2", "60");
    line2.setAttribute("stroke", "#FFC00");
    line2.setAttribute("stroke-width", "5");

    const animation = document.createElementNS(svgNS, "animate");
    animation.setAttribute("attributeName", "stroke");
    animation.setAttribute("values", "#323232;#FFC000");
    animation.setAttribute("dur", "0.1s");
    animation.setAttribute("begin", "0s");
    animation.setAttribute("fill", "freeze");

    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(animation);

    return svg.outerHTML;
}

function checkForWin() {
    // Check rows, columns, and diagonals for a win
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return pattern; // Return the winning pattern
        }
    }

    return null; // No winner yet
}

function drawWinLine(pattern) {
    const container = document.getElementById('container');
    const lineDiv = document.createElement('div');
    lineDiv.className = 'win-line';

    const [a, b, c] = pattern;
    const cellA = document.getElementById(`cell-${Math.floor(a / 3)}-${a % 3}`);
    const cellB = document.getElementById(`cell-${Math.floor(b / 3)}-${b % 3}`);
    const cellC = document.getElementById(`cell-${Math.floor(c / 3)}-${c % 3}`);

    const rectA = cellA.getBoundingClientRect();
    const rectB = cellB.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();

    const centerX = (rectA.left + rectB.left + rectC.left) / 3 + window.scrollX;
    const centerY = (rectA.top + rectB.top + rectC.top) / 3 + window.scrollY;

    const angleAB = Math.atan2(rectB.top - rectA.top, rectB.left - rectA.left) * (180 / Math.PI);
    const angleBC = Math.atan2(rectC.top - rectB.top, rectC.left - rectB.left) * (180 / Math.PI);

    const lengthAB = Math.sqrt(Math.pow(rectB.top - rectA.top, 2) + Math.pow(rectB.left - rectA.left, 2));
    const lengthBC = Math.sqrt(Math.pow(rectC.top - rectB.top, 2) + Math.pow(rectC.left - rectB.left, 2));

    const length = lengthAB + lengthBC;

    lineDiv.style.width = `${length}px`;
    lineDiv.style.height = '4px';
    lineDiv.style.backgroundColor = 'white';
    lineDiv.style.position = 'absolute';
    lineDiv.style.top = `${centerY - 2 + 52.25}px`;
    lineDiv.style.left = `${centerX - length / 2 + 52.25}px`;
    lineDiv.style.transform = `rotate(${angleAB}deg)`;

    container.appendChild(lineDiv);
}

function onClickHandler(row, col) {
    const index = row * 3 + col;
    const cell = document.getElementById(`cell-${row}-${col}`);

    if (!fields[index]) {
        fields[index] = (fields.filter(Boolean).length % 2 === 0) ? 'circle' : 'cross';

        if (fields[index] === 'circle') {
            cell.innerHTML = generateAnimatedCircle();
        } else if (fields[index] === 'cross') {
            cell.innerHTML = generateAnimatedCross();
        }

        // Remove the onclick function after setting the value
        cell.onclick = null;

        const winPattern = checkForWin();
        if (winPattern) {
            drawWinLine(winPattern);
            alert(`${fields[index]} wins!`);
        }
    }
}

function render() {
    const container = document.getElementById('container');
    const table = document.createElement('table');

    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `cell-${i}-${j}`);
            cell.onclick = function () {
                onClickHandler(i, j);
            };

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.innerHTML = '';
    container.appendChild(table);
}

function restartGame(){
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
}
// Initial render
init();