var root = document.querySelector(".box.parent");
var angle_range = document.querySelector("input");
var labelSize = 20;
var treeHeight = 0;
var initialAngle = 20;
var initialHeight = 50;
var initialPosition = 100;
var tiltedHeight = initialHeight * Math.cos((Math.PI / 180) * initialAngle);
var tiltedWidth = initialHeight * Math.sin((Math.PI / 180) * initialAngle);
var nodes = [];
var timers = [];
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var updating = false;
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
});

var treenodes = [
  {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 1,
    18: 2,
    19: 3,
    20: 4,
    21: 5,
    22: 6,
    23: 7,
    24: 8,
    25: 9,
    26: 10,
    27: 11,
    28: 12,
    29: 13,
    30: 14,
    31: 15,
    32: 16,
  },
  {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
  },
  { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
  { 1: 1, 2: 1, 3: 1, 4: 1 },
  { 1: 1, 2: 1 },
  { 1: 1 },
];

function buildLeveledTree() {
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
  if (e.value == "") {
    return;
  }
  if (e.value < 0) {
    e.value = 0;
    return;
  }
  inputs[e.id] = parseInt(e.value);
  nodes = [];
  Object.values(inputs).forEach((x) => {
    nodes.push([x, null, [0, 0]]);
  });
  nodes.sort((x, y) => {
    return x[0] - y[0];
  });
  buildTree();
  buildLeveledTree();
  build();
}

function build() {
  if (updating) {
    return;
  }
  updating = true;
  treeHeight = treenodes.length - 1;
  var parent = document.querySelector(".box");
  timers.forEach((x) => clearTimeout(x));
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  if (treenodes.length > 0) {
    addLabel(0, initialPosition, treenodes[treeHeight][1]);
  }

  if (treeHeight <= 0) {
    updating = false;
    return;
  }

  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = -1; i < 2; i += 2) {
    addLine(
      0,
      0,
      initialAngle,
      initialHeight,
      i,
      2 - (i + 1) / 2,
      treeHeight - 1
    );
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
          (j == -1 ? 1 + i : 0 - i) + 2 ** (treeHeight - (treeHeight - k + 1)),
          treeHeight - k
        );
      }
    }
  }
  updating = false;
}

build();

function buildLevelThree(treeHeight, level, direction) {
  var k = 2 ** (treeHeight - level + 2) / 2 + (direction == -1 ? 3 : -2);
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
        k,
        level - 2
      );
      k -= direction;
    }
  }
}

function buildLevelOne(treeHeight, direction) {
  var treeWidthL = 2 ** treeHeight / 4;
  if (treeHeight < 2) {
    return;
  }
  var k = direction == 1 ? 2 ** treeHeight / 2 : 2 ** treeHeight / 2 + 1;
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-tiltedWidth * 2) - tiltedWidth;
      var y = (treeHeight - 1) * tiltedHeight;
      var angle = j == 1 ? initialAngle : -initialAngle;
      addLine(x, y, angle, initialHeight, direction, k, 0);
      k += direction * -1;
    }
  }
}

function addLine(x, y, angle, height, direction, id = -1, level) {
  if (treenodes[level]?.[id] == undefined) {
    return;
  }
  var parent = document.querySelector(".box");
  var line = document.createElement("div");
  line.className = "line";
  line.style.transform = `translate(${0}px, ${
    y + initialPosition
  }px) rotateZ(${0}deg)`;
  line.id = `${level}${id}`;
  parent.appendChild(line);

  if (level == 0 && treeHeight > 1) {
    newAngle =
      (Math.asin(
        ((tiltedWidth - labelSize / 2) * (angle < 0 ? -1 : 1)) / height
      ) *
        180) /
      Math.PI;
    newAngle = angle - newAngle;
    angle -= newAngle;
  }

  timers.push(
    setTimeout(() => {
      line.style.height = `${height}px`;
      line.style.transform = `translate(${0}px, ${
        y + initialPosition
      }px) rotateZ(${0}deg)`;
    }, 100)
  );
  timers.push(
    setTimeout(() => {
      line.style.transform = `translate(${x * direction}px, ${
        y + initialPosition
      }px) rotateZ(${angle * direction}deg)`;
    }, 600)
  );
  timers.push(
    setTimeout(() => {
      labelY = height * Math.cos((Math.PI / 180) * angle) + y + initialPosition;
      labelX =
        height * Math.sin((Math.PI / 180) * angle) * (direction * -1) +
        x * direction;
      addLabel(labelX, labelY, treenodes[level]?.[id]);
    }, 1100)
  );
  return line;
}

function addLabel(x, y, id) {
  var parent = document.querySelector(".box");
  var label = document.createElement("div");
  label.className = "label";

  label.style.transform = `translate(${x}px, ${y}px)`;
  label.id = id;
  label.innerHTML = id;
  parent.appendChild(label);
  setTimeout(() => {
    label.style.height = `${labelSize}px`;
    label.style.width = `${labelSize}px`;
  }, 100);
}
