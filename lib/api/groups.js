import clownface from 'clownface'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import URL from '../core/URL.js'

async function resource (term, { hue }) {
  const groups = await (await hue).groups.getAll()

  const resource = clownface({ dataset: rdf.dataset(), term })
    .addOut(ns.rdf.type, ns.hydra.Container)
    .addOut(ns.rdfs.label, 'Groups')

  for (const group of groups) {
    resource.addOut(ns.hydra.member, (new URL(term)).resolve(group.id.toString()).toTerm(), member => {
      member
        .addOut(ns.rdf.type, ns.dh.LightGroup)
        .addOut(ns.rdfs.label, group.name)
    })
  }

  return {
    dataset: resource.dataset,
    object: groups
  }
}

export {
  resource
}
