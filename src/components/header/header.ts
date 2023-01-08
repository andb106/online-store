import { BaseComponent } from '../baseComponent';
import './header.scss';

export class Header extends BaseComponent {
  private headerPrice = new BaseComponent('div', 'header__total-price');
  private headerCartCounter = new BaseComponent('span', 'header__cart-counter');

  constructor() {
    super('header', 'header');
    const headerTitle = new BaseComponent('h1', 'header__title');
    headerTitle.element.textContent = 'Online Store';
    headerTitle.element.setAttribute('router-link', '/');

    const headerCart = new BaseComponent('div', 'header__cart');

    headerCart.element.setAttribute('router-link', '/cart');
    headerCart.append(this.headerCartCounter);

    this.updateContent();
    this.append(headerTitle, this.headerPrice, headerCart);
  }

  updateContent() {
    const count = localStorage.getItem('uliara_num') || '0';
    const price = localStorage.getItem('uliara_sum') || '0';
    this.headerPrice.element.textContent = `Total cart price: $${price}`;
    this.headerCartCounter.element.textContent = count;
  }
}
