import { BaseComponent } from '../baseComponent';
import './copyBtn.scss';

export class CopyBtn extends BaseComponent {
  constructor() {
    super('button', 'copy-btn');
    this.element.textContent = 'Copy link';
    this.element.onclick = () => {
      this.element.textContent = 'Copied !';
      this.element.classList.add('copied');

      navigator.clipboard.writeText(location.href).then(() =>
        setTimeout(() => {
          this.element.textContent = 'Copy link';
          this.element.classList.remove('copied');
        }, 400)
      );
    };
  }
}
