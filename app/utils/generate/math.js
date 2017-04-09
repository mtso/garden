function distance(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt(dx*dx + dy*dy)
}

function direction(x, y) {
  return Math.floor((y - x) / Math.abs(y - x))
}

module.exports = {
  distance,
  direction,
}
