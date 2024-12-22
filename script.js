let graph = {};
let nodes = {};  
let edges = []; 

function addEdge() {
  const fromNode = document.getElementById('from-node').value;
  const toNode = document.getElementById('to-node').value;
  const cost = parseInt(document.getElementById('cost').value, 10);

  if (!fromNode || !toNode || isNaN(cost)) {
    alert('Please fill in all fields.');
    return;
  }

  if (!graph[fromNode]) graph[fromNode] = [];
  if (!graph[toNode]) graph[toNode] = [];
  graph[fromNode].push({ city: toNode, cost });
  graph[toNode].push({ city: fromNode, cost }); 
  edges.push({ from: fromNode, to: toNode, cost });

  if (!nodes[fromNode]) nodes[fromNode] = { x: Math.random() * 400, y: Math.random() * 250 };
  if (!nodes[toNode]) nodes[toNode] = { x: Math.random() * 400, y: Math.random() * 250 };

  drawGraph();  
  document.getElementById('from-node').value = '';
  document.getElementById('to-node').value = '';
  document.getElementById('cost').value = '';
  console.log('Updated Graph:', graph);
}

function drawGraph() {
  const svg = document.getElementById('graph');
  svg.innerHTML = '';  

 
  edges.forEach(edge => {
    const from = nodes[edge.from];
    const to = nodes[edge.to];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    line.setAttribute("class", "edge");
    line.style.stroke = "black";  
    line.style.strokeWidth = "2"; 
    svg.appendChild(line);
    
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const edgeText = document.createElement("div");
    edgeText.classList.add("edge-text");
    edgeText.style.left = `${midX}px`;
    edgeText.style.top = `${midY}px`;
    edgeText.textContent = edge.cost;
    svg.appendChild(edgeText);
  });

  Object.keys(nodes).forEach(node => {
    const { x, y } = nodes[node];
    const circle = document.createElement("div");
    circle.classList.add("node");
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.textContent = node;
    document.getElementById('graph').appendChild(circle);
  });
}

function bfs(graph, start, end) {
  let queue = [[start]];
  let visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return { path, steps: visited.size };

    if (!visited.has(node)) {
      visited.add(node);
      graph[node].forEach((neighbor) => {
        queue.push([...path, neighbor.city]);
      });
    }
  }

  return { path: null, steps: visited.size }; 
}

function dfs(graph, start, end) {
  let stack = [[start]];
  let visited = new Set();

  while (stack.length > 0) {
    const path = stack.pop();
    const node = path[path.length - 1];

    if (node === end) return { path, steps: visited.size };

    if (!visited.has(node)) {
      visited.add(node);
      graph[node].forEach((neighbor) => {
        stack.push([...path, neighbor.city]);
      });
    }
  }

  return { path: null, steps: visited.size };
}

function ucs(graph, start, end) {
  let queue = [{ path: [start], cost: 0 }];
  let visited = new Set();

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost); 
    const { path, cost } = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return { path, cost, steps: visited.size };

    if (!visited.has(node)) {
      visited.add(node);
      graph[node].forEach((neighbor) => {
        queue.push({
          path: [...path, neighbor.city],
          cost: cost + neighbor.cost,
        });
      });
    }
  }

  return { path: null, cost: Infinity, steps: visited.size }; 
}

function runAlgorithm(algorithm) {
  const start = prompt("Enter the start node:");
  const end = prompt("Enter the goal node:");

  if (!start || !end) {
    alert('Please provide both start and goal nodes.');
    return;
  }

  let result;

  if (algorithm === 'bfs') result = bfs(graph, start, end);
  else if (algorithm === 'dfs') result = dfs(graph, start, end);
  else if (algorithm === 'ucs') result = ucs(graph, start, end);

  displayResult(algorithm, result);
}

function displayResult(algorithm, result) {
  const output = document.getElementById('output');
  const { path, cost, steps } = result;

  output.innerHTML = `
    <h3>${algorithm.toUpperCase()} Result:</h3>
    <p>Path: ${path ? path.join(' → ') : 'No path found'}</p>
    ${cost !== undefined ? `<p>Total Cost: ${cost}</p>` : ''}
    <p>Time Complexity (Steps): ${steps}</p>
  `;
}
