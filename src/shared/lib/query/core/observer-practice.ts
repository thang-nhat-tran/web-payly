interface Location {
  latitude: number
  longitude: number
}
interface ISubscriber {
  update(data: unknown): void
}
class Subscriber implements ISubscriber {
  private name: string
  constructor(name: string) {
    this.name = name
  }

  update(location: Location) {
    this.goToHelp(location)
  }

  goToHelp(location: Location) {
    console.log(`${this.name} :PING: ${location.latitude}, ${location.longitude}`)
  }
}

class Publisher {
  private subscribers: Subscriber[] = []

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber)
  }

  unsubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter((obs) => obs !== subscriber)
  }

  notifySubscribers(location: Location) {
    this.subscribers.forEach((subscriber) => subscriber.update(location))
  }
}

const yorn = new Subscriber('Yorn')
const alice = new Subscriber('Alice')
const publisher = new Publisher()
publisher.subscribe(yorn)
publisher.subscribe(alice)

publisher.notifySubscribers({ latitude: 10, longitude: 20 })
