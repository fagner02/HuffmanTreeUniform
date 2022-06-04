var root = document.querySelector(".box.parent");
var angle_range = document.querySelector("input");
var initial_angle = 45;
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
  //       var angle = count % 2 == 0 ? initial_angle : initial_angle * -1;
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
  //           number > exp ? initial_angle * times * -1 : initial_angle * times;
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
        var angle = count % 2 == 0 ? initial_angle : initial_angle * -1;
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
  initial_angle = e.target.value;
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
  var parent = document.querySelector(".box");
  console.log("build");
  var line = document.createElement("div");
  line.className = "line";
  line.style.transform = "rotateZ(45deg)";
  parent.appendChild(line);
  // var children = [];
  var treeHeight = 5;

  buildLevelOne(treeHeight);
  buildLevelTwo(treeHeight, parent);

  for (var i = treeHeight - 2; i < treeHeight; i++) {
    buildLevelThree(treeHeight, i, parent);
  }

  var length = Math.sqrt((70.71 * 2) ** 2 + 70.71 ** 2);
  var angle = (Math.acos(70.71 / length) * 180) / Math.PI;

  {
    for (var i = 0; i < 2; i++) {
      var line = document.createElement("div");
      line.className = "line";
      line.style.height = `${i == 0 ? 100 : length}px`;
      line.style.transform = `translate(${-70.71}px, ${
        (treeHeight - 2) * 70.71
      }px) rotateZ(${i == 0 ? 0 : angle}deg)`;
      parent.appendChild(line);
    }
  }
}

build();

function buildLevelThree(treeHeight, level, parent) {
  for (var j = 0; j < 2 ** (treeHeight - level) - 1; j++) {
    for (var i = 1; i <= 2; i++) {
      var b = 2 ** (level - 2) * i - (level == 4 ? 0 : 1);
      var a = (2 ** level - 3 - b - (level == 4 ? 1 : 0)) * 70.71;
      console.log(a, b);
      var length = Math.sqrt(70.71 ** 2 + a ** 2);
      var angle = (Math.acos(70.71 / length) * 180) / Math.PI;
      var line = document.createElement("div");
      line.className = "line";
      line.style.height = `${length}px`;
      line.style.transform = `translate(${-70.71 * 3 - j * 4 * 70.71}px, ${
        (treeHeight - (level - 2)) * 70.71
      }px) rotateZ(${angle}deg)`;
      parent.appendChild(line);
    }
  }
}

function buildLevelTwo(treeHeight, parent) {
  var length = Math.sqrt((70.71 * 2) ** 2 + 70.71 ** 2);
  var angle = (Math.acos(70.71 / length) * 180) / Math.PI;

  for (var i = 0; i < 2; i++) {
    var line = document.createElement("div");
    line.className = "line";
    line.style.height = `${i == 0 ? 70.71 : length}px`;
    line.style.transform = `translate(${-70.71}px, ${
      (treeHeight - 1) * 70.71
    }px) rotateZ(${i == 0 ? 0 : angle}deg)`;
    parent.appendChild(line);
  }
}

function buildLevelOne(treeHeight) {
  var treeWidthL = 2 ** treeHeight / 4;
  var parent = document.querySelector(".box");
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-70.71 * 2) - 70.71;
      var y = treeHeight * 70.71;
      var angle = j == 0 ? 45 : -45;
      var line = document.createElement("div");
      line.className = "line";
      line.style.transform = `translate(${x}px, ${y}px) rotateZ(${angle}deg)`;
      parent.appendChild(line);
    }
  }
}
