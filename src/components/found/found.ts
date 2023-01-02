import { BaseComponent } from '../baseComponent';

export class Found extends BaseComponent {
  count = 100;
  constructor() {
    super('div', 'found');
    this.element.textContent = `Found: ${this.count}`;
  }

  updateCount(value: number) {
    this.count = value;
    this.element.textContent = `Found: ${this.count}`;
  }
}
