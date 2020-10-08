import { resolve } from 'path'
import { URL } from 'url'
import rdf from 'rdf-ext'

class URLExt extends URL {
  constructor (input, base) {
    super(input.value || input.toString(), base)
  }

  resolve (...paths) {
    this.pathname = resolve(this.pathname, ...paths)

    if (paths.slice(-1)[0].endsWith('/')) {
      this.pathname = `${this.pathname}/`
    }

    return this
  }

  toTerm () {
    return rdf.namedNode(this.toString())
  }
}

export default URLExt
