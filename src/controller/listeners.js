import _ from 'lodash'

let listeners = {}

export function addListener (key, l) {
  // console.log('add listener', l)
  listeners[key] = l
}

export function hasListener (key) {
  return _.has(listeners, key)
}

export function clearListeners () {
  console.log('clear listeners:')
  for (const key in listeners) {
    const l = _.get(listeners, key)
    console.log('unsubscribe:', key, l)
    if (l) {
      l()
      delete listeners[key]
    }
  }

  listeners = {}
}

export function offListener (key) {
  const l = _.get(listeners, key)
  if (l) {
    l()
    delete listeners[key]
  }
}

export function offListenerWithPrefix(prefix) {
  
  for (const key in listeners) {
    if (key.indexOf(prefix) > -1) {
      const l = listeners[key]
      // console.log('unsubscribe:', l)
      // l()
      offListener(key);
    }  
  }
  
}

let userRef

export function setUserRef (ref) {
  userRef = ref
}

export function clearUserListener () {
  if (userRef) userRef()
}
