import colorMath from 'rawdevjs-math-color'

function isValidNumber (value) {
  if (typeof value !== 'number' || isNaN(value) || value === Infinity) {
    return false
  }

  return true
}

function mapNumber (value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

function fromColor ({ y, x, temperature, brightness }, state) {
  if (isValidNumber(x) && isValidNumber(y)) {
    state.xy(x, y)
  } else if (isValidNumber(temperature)) {
    state.ct(mapNumber(temperature, 6500, 2000, 153, 500))
  }

  if (isValidNumber(brightness)) {
    state.bri(brightness * 254)
  }
}

function toColor (state) {
  if (state.colormode === 'ct') {
    const temperature = mapNumber(state.ct, 153, 500, 6500, 2000)
    const { x, y } = colorMath.xyFromTemperature(temperature, 0)
    const brightness = state.bri / 254

    return { x, y, temperature, brightness }
  }

  if (state.colormode === 'xy') {
    const x = state.xy[0]
    const y = state.xy[1]
    const { temperature } = colorMath.temperatureFromXY({ x, y })
    const brightness = state.bri / 254

    return { x, y, temperature, brightness }
  }
}

export {
  fromColor,
  toColor
}
