import { Promocode } from './promocode';
import { CartItem } from './cart-item';
import { ICartItem, IProduct, IPromocode } from './../../types/index';
import { BaseComponent } from './../baseComponent';
import { updateNumsInCart } from '../../utils/db';
import promocodes from '../../data/promocodes.json';

export class CartPage extends BaseComponent {
  constructor(products: IProduct[], cart: ICartItem[]) {
    super('div', 'cart');
    this.element.innerHTML = `
      <h2 class="cart__title">Cart</h2>
      <div class="cart__main"></div>
      <div class="cart__pagination">
        <div class="cart__pages"></div>
        <div class="cart__choice">
          <span>Show</span>
          <select class="cart__select">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          <span>items on page</span>
        </div>
      </div>
      <div class="cart__total">
         <span>Total: </span>
         <span id="cartNumTotal"></span>
         <span> pieces worth </span>
         <span id="cartSumTotal" class="cart__sum"></span>
         <span class="cart__new-sum"></span>
         <span>$</span>
      </div>
      <div class="cart__promo">
        <p>Promocode: </p>
        <input type="text" id="promocodeField" placeholder="Enter promocode"/>
        <button class="btn cart__btn-promo">Apply</button>
      </div>
      <p class="cart__error">error</p>
      <div class="cart__title-promo">Applied promocodes:</div>
      <div class="cart__applied"></div>
      <button class="btn">Order</button>
    `;
    const element: HTMLElement = this.element;
    const main: HTMLElement | null = element.querySelector('.cart__main');
    const pagesBlock: HTMLElement | null = element.querySelector('.cart__pages');
    const pagesSelect: HTMLSelectElement | null = element.querySelector('.cart__select');
    const promoBtn: HTMLElement | null = element.querySelector('.cart__btn-promo');
    const promoInput: HTMLInputElement | null = element.querySelector('#promocodeField');
    const error: HTMLElement | null = element.querySelector('.cart__error');
    const promoBlock: HTMLElement | null = element.querySelector('.cart__applied');
    const promoAppliedTitle: HTMLElement | null = element.querySelector('.cart__title-promo');
    const cartSumTotal: HTMLElement | null = element.querySelector('#cartSumTotal');
    const cartNewSumTotal: HTMLElement | null = element.querySelector('.cart__new-sum');
    updateNumsInCart(this.element.querySelector('#cartNumTotal'), cartSumTotal);
    if (main !== null && pagesSelect !== null) {
      setItems(0, main, cart, products, Number(pagesSelect.value), element);
      setPages(
        main,
        cart,
        products,
        Number(pagesSelect.value),
        Math.ceil(cart.length / Number(pagesSelect.value)),
        pagesBlock,
        element
      );
      pagesSelect.addEventListener('change', function () {
        setItems(0, main, cart, products, Number(pagesSelect.value), element);
        setPages(
          main,
          cart,
          products,
          Number(this.value),
          Math.ceil(cart.length / Number(pagesSelect.value)),
          pagesBlock,
          element
        );
      });
    }
    if (promoBtn !== null && promoInput !== null && error !== null) {
      promoBtn.addEventListener('click', function () {
        const newPromo: IPromocode | undefined = checkPromo(error, promoInput.value);
        if (newPromo !== undefined && promoBlock !== null) {
          promoAppliedTitle?.classList.add('cart__title-promo--visible');
          promoBlock.append(new Promocode(newPromo).element);
          cartSumTotal?.classList.add('cart__sum--overlined');
          if (cartNewSumTotal !== null) {
            const oldSum: number = cartNewSumTotal.classList.contains('cart__new-sum--visible')
              ? Number(cartNewSumTotal.innerHTML)
              : Number(cartSumTotal?.innerHTML);
            const percent: number = (oldSum * newPromo.percentage) / 100;
            cartNewSumTotal.innerHTML = Math.floor(oldSum - percent).toString();
            cartNewSumTotal.classList.add('cart__new-sum--visible');
            promoInput.value = '';
          }
        }
      });
    }
  }
}

function setItems(
  startIdx: number,
  main: HTMLElement,
  cart: ICartItem[],
  products: IProduct[],
  num: number,
  element: HTMLElement
) {
  main.innerHTML = '';
  const end: number = num <= cart.length - startIdx ? num : cart.length - startIdx;
  for (let i = startIdx; i < startIdx + end; i += 1) {
    const product: IProduct | undefined = products.find((y) => y.id === cart[i].productId);
    if (product !== undefined) {
      main.append(new CartItem(product, i + 1, cart[i].number, products).element);
    }
  }
  const previous: HTMLElement | null = element.querySelector('.cart__page--chosen');
  previous?.classList.remove('cart__page--chosen');
}

function setPages(
  main: HTMLElement,
  cart: ICartItem[],
  products: IProduct[],
  select: number,
  pages: number,
  pagesBlock: HTMLElement | null,
  element: HTMLElement
) {
  if (pagesBlock !== null) {
    pagesBlock.innerHTML = '';
    for (let i = 1; i <= pages; i += 1) {
      const pageBtn: HTMLElement = document.createElement('button');
      pageBtn.classList.add('cart__page');
      if (i === 1) {
        pageBtn.classList.add('cart__page--chosen');
      }
      pageBtn.addEventListener('click', function () {
        setItems(select * (i - 1), main, cart, products, select, element);
        pageBtn.classList.add('cart__page--chosen');
      });
      pageBtn.innerHTML = i.toString();
      pagesBlock.append(pageBtn);
    }
  }
}

function checkPromo(error: HTMLElement, promoInput: string): IPromocode | undefined {
  error.innerHTML = '';
  error.classList.remove('cart__error--visible');
  if (promoInput === '') {
    error.innerHTML = 'Enter promocode';
    error.classList.add('cart__error--visible');
  } else {
    const promo: IPromocode | undefined = promocodes.promocodes.find((x) => x.title === promoInput);
    if (promo !== undefined) {
      return promo;
    } else {
      error.innerHTML = 'Promocode not found';
      error.classList.add('cart__error--visible');
    }
  }
}
