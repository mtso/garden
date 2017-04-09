import { distance, direction } from './math'

/*                      *
 *  HALLWAY GENERATION  *
 *                      */

// Returns a set of minimum-distance edges for connecting into hallways.
// Uses Prim's algorithm to construct a minimum spanning tree
// that connects each room's center point in O(n^2) time.
// https://en.wikipedia.org/wiki/Prim%27s_algorithm
function span(points) {
  if (points.length < 2) {
    return []
  }
  let tree = [];
  let edges = [];
  // pop first point into tree
  // calculate closest nextPoint from any point in tree
  // add nextPoint and the closeset into edges collection
  //   and add nextPoint into tree
  //   and delete nextPoint from points
  tree.push(points.pop())
  while (points.length > 0) {
    var closestEdge = {from: tree[0], to: points[0]};
    var closestDistance = distance(tree[0], points[0]);
    var closestNextIndex = 0;
    points.forEach((point, index) => {
      tree.forEach(node => {
        if (distance(node, point) < closestDistance) {
          closestEdge = {from: node, to: point}
          closestNextIndex = index;
          closestDistance = distance(node, point)
        }
      })
    })
    edges.push(closestEdge)
    tree.push(points[closestNextIndex])
    points.splice(closestNextIndex, 1)
  }
  return edges;
}

// Returns the points that connect a and b orthogonally.
function connect(a, b) {
  var points = [];
  points.push({x: a.x, y: a.y})
  let dx = direction(a.x, b.x)
  let dy = direction(a.y, b.y)
  for (var sx = a.x; sx !== b.x; sx += dx) {
    points.push({x: sx, y: a.y})
  }
  for (var sy = points[points.length - 1].y; sy !== b.y; sy += dy) {
    points.push({x: b.x, y: sy})
  }
  return points
}

module.exports = {
  span,
  connect,
}
