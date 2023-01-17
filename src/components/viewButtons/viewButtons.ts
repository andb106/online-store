import { BaseComponent } from '../baseComponent';
import './viewButtons.scss';

export class ViewButtons extends BaseComponent {
  btnTile = new BaseComponent('div', 'view-buttons__btn view-tile active-mode');
  btnList = new BaseComponent('div', 'view-buttons__btn view-list');

  constructor(callback: (viewMode: string) => void) {
    super('div', 'view-buttons');

    this.btnTile.element.onclick = () => {
      if (!this.btnTile.hasClass('active-mode')) {
        this.switchToTileMode();
        callback('tile');
      }
    };

    this.btnList.element.onclick = () => {
      if (!this.btnList.hasClass('active-mode')) {
        this.switchToListMode();
        callback('list');
      }
    };

    this.append(this.btnTile, this.btnList);
  }

  switchToTileMode() {
    this.btnList.removeClass('active-mode');
    this.btnTile.addClass('active-mode');
  }

  switchToListMode() {
    this.btnList.addClass('active-mode');
    this.btnTile.removeClass('active-mode');
  }

  updateActiveBtn(mode: string) {
    switch (mode) {
      case 'tile':
        this.switchToTileMode();
        break;
      case 'list':
        this.switchToListMode();
        break;
    }
  }
}
