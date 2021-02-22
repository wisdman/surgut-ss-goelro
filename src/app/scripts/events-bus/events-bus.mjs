
const INSTANCE = Symbol("INSTANCE")

export const EVENTS = "EVENTS"

export class EventsBus {
  static [INSTANCE] = undefined

  #subscribers = new WeakMap()

  constructor(obj) {
    const instance = EventsBus[INSTANCE] ?? this
    instance.#subscribe(obj, Object.getPrototypeOf(obj).constructor[EVENTS])
    return EventsBus[INSTANCE] = instance
  }

  #subscribe = (obj, ...events) => {
    events = events.flat().filter(eventName => obj[eventName] instanceof Function)
    if (events.length === 0) return
    this.#subscribers.set(obj, events)
  }
}