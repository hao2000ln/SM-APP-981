

var round = Math.round, size = [ 500, 280 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
function d3_layout_treemapPadNull(node) { return { x: node.x, y: node.y, dx: node.dx, dy: node.dy }; }

function scale(children, k) {
  var i = -1, n = children.length, child, area;
  while (++i < n) {
    area = (child = children[i]).value * (k < 0 ? 0 : k);
    child.area = isNaN(area) || area <= 0 ? 0 : area;
  }
}

function squarify(node) {
  var children = node.subtopics;
  if (children && children.length) {
    var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
    scale(remaining, rect.dx * rect.dy / node.value);
    row.area = 0;
    while ((n = remaining.length) > 0) {
      row.push(child = remaining[n - 1]);
      row.area += child.area;
      if (mode !== "squarify" || (score = worst(row, u)) <= best) {
        remaining.pop();
        best = score;
      } else {
        row.area -= row.pop().area;
        position(row, u, rect, false);
        u = Math.min(rect.dx, rect.dy);
        row.length = row.area = 0;
        best = Infinity;
      }
    }
    if (row.length) {
      position(row, u, rect, true);
      row.length = row.area = 0;
    }

    for (var i=0;i<children.length;i++) {
      squarify(children[i]);
    }
  }
}

function worst(row, u) {
  var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
  while (++i < n) {
    if (!(r = row[i].area)) {
        continue;
    }
    if (r < rmin) {
        rmin = r;
    }
    if (r > rmax) {
        rmax = r;
    }
  }
  s *= s;
  u *= u;
  return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
}

function position(row, u, rect, flush) {
  var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
  if (u == rect.dx) {
    if (flush || v > rect.dy) {
        v = rect.dy;
    }
    while (++i < n) {
      o = row[i];
      o.x = x;
      o.y = y;
      o.dy = v;
      x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
    }
    o.z = true;
    o.dx += rect.x + rect.dx - x;
    rect.y += v;
    rect.dy -= v;
  } else {
    if (flush || v > rect.dx) {
        v = rect.dx;
    }
    while (++i < n) {
      o = row[i];
      o.x = x;
      o.y = y;
      o.dx = v;
      y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
    }
    o.z = false;
    o.dy += rect.y + rect.dy - y;
    rect.x += v;
    rect.dx -= v;
  }
}

function treemap(d) {
  var nodes = [d], root = nodes[0];
  root.x = root.y = 0;
  if (root.value) {
    root.dx = size[0], root.dy = size[1]; 
  }
  else {
    root.dx = root.dy = 0;
  }

  scale([ root ], root.dx * root.dy / root.value);
  squarify(root);

  return nodes;
}

function recalvalue(node) {
  var index = 0, aryStoreColor = [], aryStoreKey = [];
  var aryColors = ['#d5e7aa','#0096d6','#b1e5fb','#e2d561','#e07032','#3975b1','#379443','#98b9c8','#c681c8','#7bc9f0','#fac8c8','#c69b59','#9d4c55'];
  var length = aryColors.length;

  function revalue(node) {
    var children = node.subtopics;
    node.value = (node.docs)?node.docs.length:0;
    node.color = getStoreColor(node.topic);

    if (children && children.length) {
      var count = 0;
      for (var i=0;i<children.length;i++) {
        revalue(children[i]);
        count = count + children[i].value;
      }
      node.value = count;
    }
  }
  function getStoreColor(topic) {
    for (var i=0;i<aryStoreKey.length;i++) {
      if (aryStoreKey[i]==topic) {
        return aryStoreColor[i];
      }
    }

    var rtnColor = getColor();
    aryStoreKey.push(topic);
    aryStoreColor.push(rtnColor);

    return rtnColor;
  }
  
  function getColor() {
    index = (index>=length)?(index-length):index;

    var rtnColor = aryColors[index];
    index++;

    return rtnColor;
  }

  revalue(node);

  return node;
}

function getTreeMap1st(data) {
  data = recalvalue(data);

  var arySubtopics = data.subtopics.slice(0);
  arySubtopics.sort(function(a,b) { return b.value - a.value; });

  data.subtopics = arySubtopics;

  var nodes = treemap(data);
  var node = nodes[0];
  var node1st = node.subtopics;
  var length = node1st.length, rtnAryObj = [], obj = {};

  for (var i=0;i<length;i++) {
    obj = {"topic":node1st[i].topic, "x":node1st[i].x, "y":node1st[i].y, "dx":node1st[i].dx, "dy":node1st[i].dy, "value":node1st[i].value, "color":node1st[i].color};
    rtnAryObj.push(obj);
  }

  return rtnAryObj;
}
