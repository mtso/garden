const sass = require('sass')
const { fileURLToPath, pathToFileURL } = require('url')

module.exports = function(source) {
  this.cacheable()
  const result = sass.compileString(source, {
    url: pathToFileURL(this.resourcePath),
    syntax: this.resourcePath.endsWith('.sass') ? 'indented' : 'scss',
    style: this.minimize ? 'compressed' : 'expanded',
  })
  result.loadedUrls.forEach(url => this.addDependency(fileURLToPath(url)))
  return result.css
}
