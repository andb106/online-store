import { IProduct } from './../../types/index';
import { BaseComponent } from './../baseComponent';
import '../cart/cart.scss';
import { addMoreToCart, removeFromCart } from '../../utils/db';

export class CartItem extends BaseComponent {
  constructor(data: IProduct, idx: number, count: number, all: IProduct[], updateNumsInCart: () => void) {
    super('div', 'position cart__block');
    this.element.innerHTML = `
      <span>${idx}</span>
      <img class="position__img" src="${data.thumbnail}"/>
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
          <span id="cartNum">${count}</span><span> pieces</span>
          <div class="position__number">
            <button id="cartMinus">-</button>
            <button id="cartPlus">+</button>
          </div>
        </div>
        <p class="position__stock">
          ${data.stock} pieces left in stock
        </p>
      </div>
      <span id="totalItemSum">${data.price * count}</span><span>$</span>
    `;

    const [btnPlus, btnMinus, itemNum, totalSum] = this.getSpecifiedChildren([
      '#cartPlus',
      '#cartMinus',
      '#cartNum',
      '#totalItemSum',
    ]);

    btnPlus.onclick = () => {
      if (addMoreToCart(data, count) && itemNum !== null) {
        count += 1;
        totalSum.innerHTML = (data.price * count).toString();
        itemNum.innerHTML = count.toString();
        updateNumsInCart();
      }
    };

    btnMinus.onclick = () => {
      if (itemNum !== null && removeFromCart(data, count, all)) {
        count -= 1;
        totalSum.innerHTML = (data.price * count).toString();
        itemNum.innerHTML = count.toString();
        updateNumsInCart();
      }
    };
  }
}
