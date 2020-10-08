import clownface from 'clownface'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import URL from '../core/URL.js'

async function resource (term, { hue }) {
  const lights = await (await hue).lights.getAll()

  const resource = clownface({ dataset: rdf.dataset(), term })
    .addOut(ns.rdf.type, ns.hydra.Container)
    .addOut(ns.rdfs.label, 'Lights')

  for (const light of lights) {
    resource.addOut(ns.hydra.member, (new URL(term)).resolve(`${light.id}/`).toTerm(), member => {
      member
        .addOut(ns.rdf.type, ns.dh.Light)
        .addOut(ns.rdfs.label, light.name)
    })
  }

  return {
    dataset: resource.dataset,
    object: lights
  }
}

export {
  resource
}
