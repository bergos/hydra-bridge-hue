import clownface from 'clownface'
import rdf from 'rdf-ext'
import { fromClownface as stateFromClownface, toClownface as stateToClownface } from '../state.js'
import ns from '../namespaces.js'

async function resourceGroup (term, { dataset = rdf.dataset(), hue, id }) {
  const group = await (await hue).groups.getGroup(parseInt(id))

  const resource = clownface({ dataset, term })
    .addOut(ns.rdf.type, ns.dh.LightState)

  stateToClownface(resource, group.action)

  return {
    dataset: resource.dataset,
    object: group
  }
}

async function resourceLight (term, { dataset = rdf.dataset(), hue, id }) {
  const light = await (await hue).lights.getLight(parseInt(id))

  const resource = clownface({ dataset, term })
    .addOut(ns.rdf.type, ns.dh.LightState)

  stateToClownface(resource, light.state)

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
    const object = req.hydra.resource.object

    if (object.type === 'Zone') {
      hue.groups.setGroupState(object.id, stateFromClownface(input, { group: true }))
    } else {
      hue.lights.setLightState(object.id, stateFromClownface(input))
    }

    res.status(201).end()
  } catch (err) {
    next(err)
  }
}

export {
  resourceGroup,
  resourceLight,
  get,
  put
}
