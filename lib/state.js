import ns from './namespaces.js'
import { fromColor, toColor } from './color.js'
import hueApi from 'node-hue-api'

function fromClownface (cf, { group = false } = {}) {
  const state = group ? new hueApi.v3.lightStates.GroupLightState() : new hueApi.v3.lightStates.LightState()
  const on = cf.out(ns.dh.powerState).term

  if (ns.dh.On.equals(on)) {
    state.on()
  }

  if (ns.dh.Off.equals(on)) {
    state.off()
  }

  const color = cf.out(ns.dh.color)

  if (color.term) {
    if (color.out(ns.dh.colorx).term && color.out(ns.dh.colory).term) {
      const x = parseFloat(color.out(ns.dh.colorx).value)
      const y = parseFloat(color.out(ns.dh.colory).value)
      const brightness = parseFloat(color.out(ns.dh.brightness).value)

      fromColor({ x, y, brightness }, state)
    } else if (color.out(ns.dh.colorTemperature).term) {
      const temperature = parseFloat(color.out(ns.dh.colorTemperature).value)
      const brightness = parseFloat(color.out(ns.dh.brightness).value)

      fromColor({ temperature, brightness }, state)
    }
  }

  return state
}

function toClownface (cf, state) {
  cf.addOut(ns.dh.powerState, state.on ? ns.dh.On : ns.dh.Off)

  const color = toColor(state)

  cf.addOut(ns.dh.color, ptr => {
    ptr
      .addOut(ns.dh.colorx, color.x)
      .addOut(ns.dh.colory, color.y)
      .addOut(ns.dh.colorTemperature, color.temperature)
      .addOut(ns.dh.brightness, color.brightness)
  })
}

export {
  fromClownface,
  toClownface
}
