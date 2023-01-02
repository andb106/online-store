import { BaseComponent } from '../baseComponent';

export class ResetBtn extends BaseComponent {
  constructor(callback: () => void) {
    super('button', 'reset-btn');
    this.element.textContent = 'Reset Filters';
    this.element.onclick = () => {
      callback();
    };
  }
}
