var root = document.querySelector(".box.parent");
var angle_range = document.querySelector("input");
var initialAngle = 20;
var initialHeight = 50;
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

var boxes = [];

function initializeTree() {
  boxes = [];
  var label = document.createElement("div");
  label.className = "label";
  root.appendChild(label);

  var text = document.createElement("h2");
  text.innerHTML = tree[0][0];
  label.appendChild(text);

  var box = document.createElement("div");
  box.className = "box";
  root.appendChild(box);

  setTimeout(() => {
    label.style.width = "50px";
    label.style.height = "50px";
    boxes.push([tree[0][0], box]);
    buildVizualizer();
  }, 10);
}

function buildVizualizer() {
  var temp_nodes = tree;
  temp_nodes[0][0] = [temp_nodes[0][0], 0, 0];
  var exp = 1;
  // while (temp_nodes.length > 0) {
  //   var temp_boxes = [];
  //   var temp = temp_nodes;
  //   temp_nodes = [];
  //   var count = 0;
  //   temp.forEach((parent_node) => {
  //     if (parent_node[1] == null) {
  //       return;
  //     }

  //     var node_number = parent_node[0][2] * 2;

  //     parent_node[1].forEach((node) => {
  //       var angle = count % 2 == 0 ? initialAngle : initialAngle * -1;
  //       count++;
  //       var number = node_number + 1;
  //       var num = number > exp ? number - exp - 1 : exp - number;
  //       if (exp > 2) {
  //         var times = Math.floor(num / 4) * 3;
  //         times = times == 0 ? 1 : times;
  //         if (exp > 8) {
  //           times = 1;
  //         }
  //         angle +=
  //           number > exp ? initialAngle * times * -1 : initialAngle * times;
  //       }
  //       var box_id = boxes.findIndex((x) => {
  //         return x[0] == parent_node[0][0];
  //       });

  //       temp_boxes.push(
  //         [node[0], addNode(boxes[box_id][1], node[0], angle, 0)],
  //         num
  //       );

  //       if (boxes[box_id][1].children.length >= 2) {
  //         boxes.splice(box_id, 1);
  //       }

  //       if (node[1] != null) {
  //         temp_nodes.push([[node[0], num, node_number], node[1]]);
  //       }
  //       node_number++;
  //     });
  //   });

  //   count = 0;
  //   boxes = temp_boxes;
  //   exp = exp << 1;
  // }
}

function addNode(node, num, angle, height) {
  var parent = document.createElement("div");
  parent.className = "labels";

  var line = document.createElement("div");
  line.className = "line";
  parent.appendChild(line);

  var label = document.createElement("div");
  label.className = "label";
  parent.appendChild(label);

  var text = document.createElement("h2");
  text.innerHTML = num;
  label.appendChild(text);

  var box = document.createElement("div");
  box.className = "box";
  parent.appendChild(box);

  node.appendChild(parent);

  setTimeout(() => {
    line.style.height = `${150 - height}px`;
    setTimeout(() => {
      label.style.width = "50px";
      label.style.height = "50px";
      setTimeout(() => {
        parent.style.transform = `rotateZ(${angle}deg)`;
      }, 300);
    }, 500);
  }, 10);
  return box;
}

function updateVizualizer() {
  boxes = [root.lastChild];
  var temp_boxes;
  while (boxes.length > 0) {
    temp_boxes = [];
    var count = 0;
    boxes.forEach((parent_node) => {
      if (parent_node == null) {
        return;
      }
      var children = Array.from(parent_node.children);
      children.forEach((node) => {
        var angle = count % 2 == 0 ? initialAngle : initialAngle * -1;
        count++;

        node.style.transform = `rotateZ(${angle}deg)`;

        if (node.children[2].firstChild != null) {
          temp_boxes.push(node.children[2]);
        }
      });
    });

    count = 0;
    boxes = temp_boxes;
  }
}

angle_range.addEventListener("input", (e) => {
  initialAngle = e.target.value;
  updateVizualizer();
});

function rebuildTree() {
  if (root.children.length > 0) {
    while (root.firstChild != null) {
      root.removeChild(root.firstChild);
    }
  }

  buildTree();
  initializeTree();
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
  // console.table(nodes);
  // rebuildTree();
  buildTree();
  console.table(tree);
}

// ==========================================================
// ==========================================================
function build() {
  var treeHeight = 6;

  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = -1; i < 2; i += 2) {
    addLine(0, 0, initialAngle, initialHeight, i);
  }
  for (var j = -1; j < 2; j += 2) {
    buildLevelOne(treeHeight, j);
    buildLevelTwo(treeHeight, j);

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
          j
        );
      }
    }
  }
}

build();

function buildLevelThree(treeHeight, level, direction) {
  for (var j = 0; j < 2 ** (treeHeight - level) - 1; j++) {
    for (var i = 1; i <= 2; i++) {
      var width = 2 ** (level - 2) * i * tiltedWidth;
      var length = Math.sqrt(tiltedHeight ** 2 + width ** 2);
      var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;
      addLine(
        -tiltedWidth * 3 - j * 2 ** (level - 1) * tiltedWidth,
        (treeHeight - (level - 1)) * tiltedHeight,
        angle,
        length,
        direction
      );
    }
  }
}

function buildLevelTwo(treeHeight, direction) {
  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = 0; i < 2; i++) {
    addLine(
      -tiltedWidth,
      (treeHeight - 2) * tiltedHeight,
      i == 0 ? 0 : angle,
      i == 0 ? tiltedHeight : length,
      direction
    );
  }
}

function buildLevelOne(treeHeight, direction) {
  var treeWidthL = 2 ** treeHeight / 4;
  var parent = document.querySelector(".box");
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-tiltedWidth * 2) - tiltedWidth;
      var y = (treeHeight - 1) * tiltedHeight;
      var angle = j == 0 ? initialAngle : -initialAngle;
      addLine(x, y, angle, initialHeight, direction);
    }
  }
}

function addLine(x, y, angle, height, direction) {
  var parent = document.querySelector(".box");
  var line = document.createElement("div");
  line.className = "line";
  line.style.height = `${height}px`;
  line.style.transform = `translate(${x * direction}px, ${y}px) rotateZ(${
    angle * direction
  }deg)`;
  parent.appendChild(line);
}
