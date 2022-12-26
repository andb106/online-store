import { IProduct } from '../../types/index';
import { BaseComponent } from '../baseComponent';
import './product.scss';

export class Product extends BaseComponent {
  id: number;
  constructor(data: IProduct, cbClick?: () => void) {
    super('div', 'product');
    this.id = data.id;
    this.element.innerHTML = `
    <img src="${data.images[0]}" alt="${data.title}" class="product__image" />
    <div class="product__body">
      <h3 class="product__title">${data.title}</h3>
      <p class="card-text">$${data.description}</p>
    </div>
    `;
    if (cbClick) this.element.onclick = cbClick.bind(this.element, this.id);
  }
}
