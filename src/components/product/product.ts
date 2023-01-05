import { IProduct } from '../../types/index';
import { BaseComponent } from '../baseComponent';
import './product.scss';

export class Product extends BaseComponent {
  id: number;
  constructor(data: IProduct, onDetails: (value: number) => void) {
    super('div', 'product');
    this.id = data.id;
    this.element.innerHTML = `
    <h3 class="product__title">${data.title}</h3>
    <img src="${data.thumbnail}" alt="${data.title}" class="product__image" />
    <div class="product__body">
      <p class="product__item">Category: ${data.category}</p>
      <p class="product__item">Brand: ${data.brand}</p>
      <p class="product__item">Rating: ${data.rating}</p>
      <p class="product__item">Stock: ${data.stock}</p>
    </div>
    <p class="product__price">Price: $${data.price}</p>
    `;
    const btns = new BaseComponent('div', 'product__buttons');

    const btnToCart = new BaseComponent('div', 'product__btn');
    btnToCart.element.textContent = 'Add to cart';

    const btnDetails = new BaseComponent('div', 'product__btn');
    btnDetails.element.textContent = 'Details';

    btns.element.append(btnToCart.element, btnDetails.element);
    btnDetails.element.onclick = () => {
      onDetails(this.id);
    };

    this.element.append(btns.element);
    // if (cbClick) this.element.onclick = cbClick.bind(this.element, this.id);
  }
  toggleView() {
    this.element.children[2].classList.toggle('hidden');
  }
}
