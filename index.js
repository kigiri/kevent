import { regular, shifted } from './definitions.js'

const keyEvents = [ 'keypress', 'keyup', 'keydown' ]
const modifiers = [ 'ctrl', 'shift', 'meta', 'alt' ]
const handlersJSON = JSON.stringify(Array(3).fill()
  .reduce(a => [ a, JSON.parse(JSON.stringify(a)) ], [{},{}]))

const getWhichCode = key => typeof key === 'number'
  ? key
  : (shifted[key] || regular[key] || key.toUpperCase().charCodeAt(0))

const makeHandler = (noPreventSet, handlers) => e => {
  const fn = handlers[+e.ctrlKey][+e.shiftKey][+e.metaKey][+e.altKey][e.which]
  if (fn) {
    noPreventSet.has(fn) || e.preventDefault()
    fn(e)
  }
}

const id = _ => _
const isEvent = s => keyEvents.includes(s)
const specialKey = [ ...modifiers, ...keyEvents, 'default' ]
export const kevent = ({ elem = window } = {}) => {
  const noPreventSet = new WeakSet
  const events = {}
  const getEvent = eventName => {
    if (events[eventName]) return events[eventName]
    const handlers = JSON.parse(handlersJSON)
    elem.addEventListener(eventName, makeHandler(noPreventSet, handlers))
    return events[eventName] = handlers
  }

  const proxyMod = args => new Proxy({}, {
    get: (src, key) => {
      if (specialKey.includes(key)) return proxyMod([ ...args, key ])
      if (/[A-Z]/.test(key) || shifted[key]) {
        args.push('shift')
      }

      const keepDefault = modifiers.includes('default')
      const handlers = args.filter(isEvent)
      handlers.length || handlers.push(eventsType[0])
      const code = getWhichCode(key)
      const findMatch = (acc, mod) => acc[Number(args.includes(mod))]
      const set = handlers.map(h => modifiers.reduce(findMatch, getEvent(h)))
        .reduce((setter, target) => value => target[code] = setter(value), id)

      return fn => {
        keepDefault
          ? noPreventSet.add(set(e => fn(e)))
          : set(fn)
        return () => set()
      }
    }
  })

  return proxyMod([])
}

export default kevent
