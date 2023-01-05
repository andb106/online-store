import { BaseComponent } from '../baseComponent';
import './viewButtons.scss';

export class ViewButtons extends BaseComponent {
  constructor(callback: (viewMode: string) => void) {
    super('div', 'view-buttons');
    const btnTile = new BaseComponent('div', 'view-buttons__btn view-tile active-mode');
    const btnList = new BaseComponent('div', 'view-buttons__btn view-list');

    btnTile.element.onclick = () => {
      if (!btnTile.element.classList.contains('active-mode')) {
        btnList.element.classList.remove('active-mode');
        btnTile.element.classList.add('active-mode');
        callback('tile');
      }
    };

    btnList.element.onclick = () => {
      if (!btnList.element.classList.contains('active-mode')) {
        btnTile.element.classList.remove('active-mode');
        btnList.element.classList.add('active-mode');
        callback('list');
      }
    };

    this.element.append(btnTile.element, btnList.element);
  }

  updateActiveBtn(mode: string) {
    const buttons = [...this.element.children];
    switch (mode) {
      case 'tile':
        buttons[0].classList.add('active-mode');
        buttons[1].classList.remove('active-mode');
        break;
      case 'list':
        buttons[1].classList.add('active-mode');
        buttons[0].classList.remove('active-mode');
        break;
    }
  }
}
