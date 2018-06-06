const regular = {
  backspace: 8,
  tab: 9,
  enter: 13,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  ';': 186,
  semicolon: 186,
  '=': 187,
  equal: 187,
  ',': 188,
  comma: 188,
  '-': 189,
  minus: 189,
  '.': 190,
  dot: 190,
  '/': 191,
  slash: 191,
  '`': 192,
  backtick: 192,
  '[': 219,
  openbraket: 219,
  '\\': 220,
  backslash: 220,
  ']': 221,
  closebraket: 221,
  "'": 222,
  quote: 222
}

const shifted = {
  ')': 48,
  closeparen: 48,
  '!': 49,
  bang: 49,
  '@': 50,
  at: 50,
  '#': 51,
  hash: 51,
  '$': 52,
  dollar: 52,
  '%': 53,
  percent: 53,
  '^': 54,
  caret: 54,
  '&': 55,
  ampersand: 55,
  '*': 56,
  asterisk: 56,
  '(': 57,
  openparen: 57,
  ':': 186,
  colon: 186,
  '+': 187,
  plus: 187,
  '<': 188,
  gt: 188,
  _: 189,
  '>': 190,
  lt: 190,
  '?': 191,
  questionmark: 191,
  '~': 192,
  tilde: 192,
  '{': 219,
  openbrace: 219,
  '|': 220,
  pipe: 220,
  '}': 221,
  closebrace: 221,
  '"': 222,
  doublequote: 222
}

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
export const kevent = ({ eventsType = keyEvents, elem = window } = {}) => {
  const noPreventSet = new WeakSet
  const events = {}
  const specialKey = [ ...modifiers, ...eventsType, 'default' ]
  const isEvent = s => eventsType.includes(s)
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
