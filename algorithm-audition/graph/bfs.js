const graph = require('./graph');

const bfs = (m) => {
  const visited = new Set();
  visited.add(m);
  const q = [m];
  while (q.length) {
    const n = q.shift();
    console.log(n);
    graph[n].forEach((c) => {
      if (!visited.has(c)) {
        q.push(c);
        visited.add(c);
      }
    });
  }
};
bfs(2);
