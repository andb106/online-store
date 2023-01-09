import { BaseComponent } from '../baseComponent';
import './resetBtn.scss';

export class ResetBtn extends BaseComponent {
  constructor(callback: () => void) {
    super('button', 'btn reset-btn');
    this.element.textContent = 'Reset Filters';
    this.element.onclick = () => {
      callback();
    };
  }
}
