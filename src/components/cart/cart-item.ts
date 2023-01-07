import { IProduct } from './../../types/index';
import { BaseComponent } from './../baseComponent';
import '../cart/cart.scss';
import { addMoreToCart, removeFromCart } from '../../utils/db';

export class CartItem extends BaseComponent {
  data: IProduct;
  num: number;
  constructor(data: IProduct, idx: number, num: number, all: IProduct[]) {
    super('div', 'position cart__block');
    this.data = data;
    this.num = num;
    this.element.innerHTML = `
      <span>${idx}</span>
      <div class="position__info">
        <span class="position__title">${data.title}</span>
        <span>${data.category}</span>
        <span>${data.brand}</span>
        <span>${data.rating}/5</span>
      </div>
      <div class="position__calc">
        <div class="position__money">
          <span>${data.price}$</span>
          <span>x</span>
          <span id="cartNum">${num}</span><span> pieces</span>
          <div class="position__number">
            <button id="cartMinus">-</button>
            <button id="cartPlus">+</button>
          </div>
        </div>
        <p class="position__stock">
          ${data.stock} pieces left in stock
        </p>
      </div>
      <span>${data.price * num}$</span>
    `;
    const btnPlus: HTMLElement | null = this.element.querySelector('#cartPlus');
    const btnMinus: HTMLElement | null = this.element.querySelector('#cartMinus');
    const itemNum: HTMLElement | null = this.element.querySelector('#cartNum');
    if (btnPlus !== null && itemNum !== null) {
      btnPlus.onclick = () => {
        if (addMoreToCart(data, num) && itemNum !== null) {
          num += 1;
          itemNum.innerHTML = num.toString();
        }
      };
    }
    if (btnMinus !== null && itemNum !== null) {
      btnMinus.onclick = () => {
        if (itemNum !== null && removeFromCart(data, num, all)) {
          num -= 1;
          itemNum.innerHTML = num.toString();
        }
      };
    }
  }
}
