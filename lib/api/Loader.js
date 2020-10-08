import RoutingResourceLoader from '../core/RoutingResourceLoader.js'
import { resource as bridge } from './bridge.js'
import { resource as group } from './group.js'
import { resource as groups } from './groups.js'
import { resource as light } from './light.js'
import { resource as lights } from './lights.js'
import { resourceGroup as stateGroup, resourceLight as stateLight } from './state.js'

class Loader extends RoutingResourceLoader {
  constructor ({ basePath = '', hue }) {
    super({ basePath })

    this.hue = hue

    this.exact('/', (path, params, { term }) => bridge(term))
    this.exact('/group/', (path, params, { term }) => groups(term, { hue }))
    this.exact('/group/:id', (path, { id }, { term }) => group(term, { hue, id }))
    this.exact('/group/:id/state', (path, { id }, { term }) => stateGroup(term, { hue, id }))
    this.exact('/light/', (path, params, { term }) => lights(term, { hue }))
    this.exact('/light/:id', (path, { id }, { term }) => light(term, { hue, id }))
    this.exact('/light/:id/state', (path, { id }, { term }) => stateLight(term, { hue, id }))
  }
}

export default Loader
