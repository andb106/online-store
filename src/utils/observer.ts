export class Observer<TDataObserver> {
  observers: ((data: TDataObserver) => void)[];

  constructor() {
    this.observers = [];
  }

  subscribe(fn: (data: TDataObserver) => void) {
    this.observers.push(fn);
  }

  unsubscribe(fn: () => void) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(data: TDataObserver) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}
