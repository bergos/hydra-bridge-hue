import clownface from 'clownface'
import rdf from 'rdf-ext'
import URL from '../core/URL.js'
import { fromClownface as stateFromClownface } from '../state.js'
import ns from '../namespaces.js'
import { resourceLight as stateResourceLight } from './state.js'

async function resource (term, { hue, id }) {
  const light = await (await hue).lights.getLight(parseInt(id))

  const resource = clownface({ dataset: rdf.dataset(), term })
    .addOut(ns.rdf.type, ns.dh.Light)
    .addOut(ns.rdfs.label, light.name)

  const state = resource
    .addOut(ns.dh.state, (new URL(term)).resolve('state').toTerm())
    .out(ns.dh.state)

  await stateResourceLight(state.term, {
    dataset: state.dataset,
    hue,
    id
  })

  return {
    dataset: resource.dataset,
    object: light
  }
}

async function get (req, res) {
  res.dataset(req.hydra.resource.dataset)
}

async function put (req, res, next) {
  try {
    const hue = await req.app.locals.hue
    const input = clownface({ dataset: await req.dataset() })
    const light = req.hydra.resource.object

    hue.lights.setLightState(light.id, stateFromClownface(input))

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
