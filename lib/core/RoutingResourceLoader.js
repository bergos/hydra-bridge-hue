import clownface from 'clownface'
import TermSet from '@rdfjs/term-set'
import Router from './Router.js'
import URL from './URL.js'
import ns from '../namespaces.js'

class RoutingResourceLoader {
  constructor ({ basePath = '' } = {}) {
    this.basePath = basePath
    this.router = new Router()
  }

  exact (path, callback) {
    this.router.exact(this.basePath + path, callback)
  }

  any (path, callback) {
    this.router.any(this.basePath + path, callback)
  }

  async load (term) {
    let { dataset, types, ...others } = (await this.router.handle(new URL(term).pathname, { term })) || {}

    if (!dataset || dataset.size === 0) {
      return null
    }

    if (!types) {
      types = new TermSet(clownface({ dataset, term }).out(ns.rdf.type).terms)
    }

    return {
      term,
      dataset,
      types,
      ...others
    }
  }

  async forClassOperation (term) {
    const resource = await this.load(term)

    return resource ? [resource] : []
  }

  async forPropertyOperation (term) {
    return []
  }
}

export default RoutingResourceLoader
