var root = document.querySelector(".box.parent");
var angle_range = document.querySelector("input");
var initialAngle = 20;
var initialHeight = 50;
var initialPosition = 100;
var tiltedHeight = initialHeight * Math.cos((Math.PI / 180) * initialAngle);
var tiltedWidth = initialHeight * Math.sin((Math.PI / 180) * initialAngle);
var nodes = [];

var tree = [];

function buildTree() {
  tree = nodes;
  if (nodes.length == 0) {
    return;
  }
  if (nodes.length == 1) {
    tree.push(nodes[0]);
    return;
  }
  var node = tree[0][0] + tree[1][0];
  var heightL = Math.max(...tree[0][2]) + 1;
  var heightR = Math.max(...tree[1][2]) + 1;
  var slice = tree.slice(0, 2);
  tree.splice(0, 2);
  tree.push([node, slice, [heightL, heightR]]);

  tree.sort((x, y) => {
    return x[0] - y[0];
  });

  if (tree.length == 1) {
    return;
  }

  buildTree();
}

angle_range.addEventListener("input", (e) => {
  initialAngle = e.target.value;
  updateVizualizer();
});
var treenodes = [];
function rebuildTree() {
  var level = 0;
  treenodes = [];
  var tempTree = [[tree[0][0], tree[0][1], 1]];

  while (true) {
    var temp = [];
    if (treenodes.length < level + 1) {
      treenodes.push({});
    }
    var i = 0;
    tempTree.forEach((x) => {
      treenodes[level][x[2]] = x[0];

      x[1]?.forEach((y) => {
        temp.push([y[0], y[1], x[2] * 2 - (i % 2 == 0 ? 1 : 0)]);
        i++;
      });
    });
    if (i == 0) {
      break;
    }
    level++;
    tempTree = temp;
  }
  treenodes = treenodes.reverse();
}

var card_id = 0;
function addCard() {
  console.log("addCard");
  var card = document.createElement("div");
  card.className = "node";
  var nodes = document.querySelector(".nodes");
  var input = document.createElement("input");
  input.type = "number";
  input.className = "num";
  input.id = card_id;
  card_id++;
  card.appendChild(input);
  document.querySelector(".add_card").before(card);
  input.addEventListener("input", (e) => {
    receiveInput(e.target);
  });
}
var inputs = {};

function receiveInput(e) {
  console.log("receiveInput", e);
  if (e.value == "") {
    return;
  }
  if (e.value < 0) {
    e.value = 0;
    return;
  }
  console.log(e.value);
  inputs[e.id] = parseInt(e.value);
  nodes = [];
  Object.values(inputs).forEach((x) => {
    console.log(x);
    nodes.push([x, null, [0, 0]]);
  });
  nodes.sort((x, y) => {
    return x[0] - y[0];
  });
  buildTree();
  rebuildTree();
  console.table(treenodes);
  console.log(treenodes[0][1]);
}

function build() {
  var treeHeight = 5;

  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = -1; i < 2; i += 2) {
    addLine(0, 0, initialAngle, initialHeight, i);
  }
  for (var j = -1; j < 2; j += 2) {
    buildLevelOne(treeHeight, j);

    for (var i = 3; i < treeHeight; i++) {
      buildLevelThree(treeHeight, i, j);
    }
    for (var k = 2; k < treeHeight; k++) {
      for (var i = 0; i < 2; i++) {
        addLine(
          -tiltedWidth,
          (k - 1) * tiltedHeight,
          i == 0 ? 0 : angle,
          i == 0 ? tiltedHeight : length,
          j,
          (j == -1 ? 1 + i : 0 - i) + 2 ** (treeHeight - (treeHeight - k + 1))
        );
      }
    }
  }
}

build();

function buildLevelThree(treeHeight, level, direction) {
  var k = direction == -1 ? 1 : 0;
  for (var j = 0; j < 2 ** (treeHeight - level) - 1; j++) {
    for (var i = 1; i <= 2; i++) {
      var width = 2 ** (level - 2) * i * tiltedWidth;
      var length = Math.sqrt(tiltedHeight ** 2 + width ** 2);
      var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

      var l = addLine(
        -tiltedWidth * 3 - j * 2 ** (level - 1) * tiltedWidth,
        (treeHeight - (level - 1)) * tiltedHeight,
        angle,
        length,
        direction,
        k
      );
      if (level == 3) {
        console.log(l);
      }
      k++;
    }
  }
}

function buildLevelOne(treeHeight, direction) {
  var treeWidthL = 2 ** treeHeight / 4;
  var k = direction == 1 ? 2 ** treeHeight / 2 : 2 ** treeHeight / 2 + 1;
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-tiltedWidth * 2) - tiltedWidth;
      var y = (treeHeight - 1) * tiltedHeight;
      var angle = j == 1 ? initialAngle : -initialAngle;
      addLine(x, y, angle, initialHeight, direction, k);
      k += direction * -1;
    }
  }
}

function addLine(x, y, angle, height, direction, id = -1) {
  var parent = document.querySelector(".box");
  var line = document.createElement("div");
  line.className = "line";
  line.style.height = `${height}px`;
  line.style.transform = `translate(${x * direction}px, ${
    y + initialPosition
  }px) rotateZ(${angle * direction}deg)`;
  line.id = id;
  parent.appendChild(line);
  return line;
}
