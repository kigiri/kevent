# kevent
keyboard event handler

## Usage:
```js
import { kevent } from 'https://unpkg.com/kevent@1.0.0/index.js'

const on = kevent()

on.keypress.ctrl.shift.k(() => {
  console.log('keypress: ctrl+shift+k')
})

// But keypress is the default event so we can omit it
on.ctrl.shift.k(() => {
  console.log('keypress: ctrl+shift+k')
})

// Most letter keys can be uppercase so we can omit shift
on.ctrl.K(() => {
  console.log('keypress: ctrl+shift+k')
})

on.default.ctrl.K(e => {
  console.log('keypress: ctrl+shift+k')
  // you can now manualy call, or not e.preventDefault
})

// It is possible to share base arguments
const shortcut = kevent().default.meta.keydown

shortcut.tab(() => console.log('keydown meta+tab without prevent default'))
shortcut.L(() => console.log('keydown meta+shift+l without prevent default'))

// For now you have only one option:
const { keydown, keyup } = kevent({
  elem: document.getElementById('elem') // dom element to attach to
  // defaults to window
})

// It is possible to use directly the keyCode if you want
keydown[13](() => console.log('key 13 down (enter)'))
keyup[13](() => console.log('key 13 up (enter)'))

// Because 0-9 can be both the num row or keycodes
// they are aliased from _0 to _9
keyup._1(() => console.log('numrow 1 pressed'))

// Shifted aliases are based on QWERTY layout
keyup['!'](() => console.log('shift + numrow 1 pressed'))

// Of course you can always expand to
keyup.shift._1(() => console.log('shift + numrow 1 pressed'))
```

## All keys available are
- `A-Z` (lower and upper, from `.charCodeAt`)
- `0-9` (aliased to `_0` and `_9`)
- `f1-f24`
- `numpad0-numpad9`

_Read [definition.js](https://github.com/kigiri/kevent/blob/master/definition.js)
for the complete list._

