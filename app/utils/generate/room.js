
function center(room) {
  return {
    x: room.origin.x + Math.floor(room.size / 2),
    y: room.origin.y + Math.floor(room.size / 2),
  }
}

module.exports = {
  center,
}
