import clownface from 'clownface'
import rdf from 'rdf-ext'
import URL from '../core/URL.js'
import { fromClownface as stateFromClownface } from '../state.js'
import ns from '../namespaces.js'
import { resourceGroup as stateResourceGroup } from './state.js'

async function resource (term, { hue, id }) {
  const group = await (await hue).groups.getGroup(parseInt(id))

  const resource = clownface({ dataset: rdf.dataset(), term })
    .addOut(ns.rdf.type, ns.dh.LightGroup)
    .addOut(ns.rdfs.label, group.name)

  const state = resource
    .addOut(ns.dh.state, (new URL(term)).resolve('state').toTerm())
    .out(ns.dh.state)

  await stateResourceGroup(state.term, {
    dataset: state.dataset,
    hue,
    id
  })

  return {
    dataset: resource.dataset,
    object: group
  }
}

async function get (req, res) {
  res.dataset(req.hydra.resource.dataset)
}

async function put (req, res, next) {
  try {
    const hue = await req.app.locals.hue
    const input = clownface({ dataset: await req.dataset() })
    const group = req.hydra.resource.object

    hue.groups.setGroupState(group.id, stateFromClownface(input, { group: true }))

    res.status(201).end()
  } catch (err) {
    next(err)
  }
}

export {
  resource,
  get,
  put
}
