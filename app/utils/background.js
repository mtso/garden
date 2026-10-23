const catalog = require('../assets/backgrounds.json')
const { BACKGROUND_COLOR } = require('../config')

function createBackground(size, random = Math.random, color = BACKGROUND_COLOR) {
  const art = catalog[Math.floor(random() * catalog.length)]
  const width = Math.max(...art.rows.map(row => row.length))
  return {
    id: art.id,
    rows: art.rows,
    origin: {
      x: Math.floor(((size * 2 - 1) - width) / 2),
      y: Math.floor((size - art.rows.length) / 2),
    },
    color,
  }
}

module.exports = { createBackground }
