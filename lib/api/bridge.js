import clownface from 'clownface'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import URL from '../core/URL.js'

async function resource (term) {
  const resource = clownface({ dataset: rdf.dataset(), term })
    .addOut(ns.rdf.type, ns.hydra.Container)
    .addOut(ns.rdf.type, ns.dh.Bridge)
    .addOut(ns.rdfs.label, 'Hue Bridge')
    .addOut(ns.hydra.member, (new URL(term)).resolve('group/').toTerm())
    .addOut(ns.hydra.member, (new URL(term)).resolve('light/').toTerm())

  return {
    dataset: resource.dataset
  }
}

export {
  resource
}
