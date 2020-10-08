class Router {
  constructor () {
    this.routes = []
  }

  add ({ path, callback, end }) {
    const vars = []

    const expStr = path
      .split('/')
      .map(part => {
        if (part.startsWith(':')) {
          vars.push(part.slice(1))

          return '([^/]*)'
        }

        return part
      })
      .join('/')

    this.routes.push({
      exp: new RegExp(`^${expStr}${end ? '$' : ''}`),
      vars,
      callback
    })
  }

  exact (path, callback) {
    this.add({
      path,
      callback,
      end: true
    })
  }

  any (path, callback) {
    this.add({
      path,
      callback,
      end: false
    })
  }

  async handle (path, context = {}) {
    for (const route of this.routes) {
      const match = route.exp.exec(path)

      if (!match) {
        continue
      }

      const params = match.slice(1).reduce((params, value, index) => {
        params[route.vars[index]] = value

        return params
      }, {})

      const result = await route.callback(path, params, context)

      if (typeof result !== 'undefined') {
        return result
      }
    }
  }
}

export default Router
