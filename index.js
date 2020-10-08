import express from 'express'
import once from 'lodash/once.js'
import hydraBox from 'hydra-box/middleware.js'
import Api from 'hydra-box/Api.js'
import hueApi from 'node-hue-api'
import EsmLoader from 'rdf-loader-code/ecmaScriptModule.js'
import Loader from './lib/api/Loader.js'

async function middleware (config) {
  const hue = hueApi.v3.api.createLocal(config.hue.host).connect(config.hue.user)

  // wait for the first request to figure out the used basePath
  const init = once(async ({ basePath }) => {
    const api = await Api.fromFile('./lib/api/api.ttl', {
      path: '/api',
      codePath: process.cwd()
    })

    // hydra-box doesn't register the ESM loader yet by default
    EsmLoader.register(api.loaderRegistry)

    const loader = new Loader({ basePath, hue })

    return hydraBox(api, { loader })
  })

  const app = express()

  app.locals.hue = hue

  app.use(async (req, res, next) => {
    (await init({ basePath: req.baseUrl }))(req, res, next)
  })

  return app
}

export default middleware
