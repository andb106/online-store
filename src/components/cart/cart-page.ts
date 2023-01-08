import { Promocode } from './promocode';
import { CartItem } from './cart-item';
import { ICartItem, IProduct, IPromocode } from './../../types/index';
import { BaseComponent } from './../baseComponent';
import promocodes from '../../data/promocodes.json';
import { CartData, getCart, getCartNumberData } from '../../utils/db';

export class CartPage extends BaseComponent {
  constructor(private products: IProduct[], private cart: ICartItem[]) {
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

    this.setEventListeners();
  }

  setEventListeners() {
    const [pagesSelect, promoBtn, promoInput, promoBlock, promoAppliedTitle, cartSumTotal, cartNewSumTotal] =
      this.getSpecifiedChildren([
        '.cart__select',
        '.cart__btn-promo',
        '#promocodeField',
        '.cart__applied',
        '.cart__title-promo',
        '#cartSumTotal',
        '.cart__new-sum',
      ]);

    this.updateNumsInCart();

    const currentPage = Number((pagesSelect as HTMLSelectElement).value);

    this.setItems(0, currentPage);
    this.setPages(currentPage, Math.ceil(this.cart.length / currentPage));

    pagesSelect.addEventListener('change', () => {
      const selectedPage = Number((pagesSelect as HTMLSelectElement).value);
      this.setItems(0, selectedPage);
      this.setPages(selectedPage, Math.ceil(this.cart.length / selectedPage));
    });

    promoBtn.addEventListener('click', () => {
      const newPromo: IPromocode | undefined = this.checkPromo((promoInput as HTMLInputElement).value);

      if (!newPromo) return;

      promoAppliedTitle.classList.add('cart__title-promo--visible');
      promoBlock.append(new Promocode(newPromo, this.deletePromocode.bind(this)).element);
      cartSumTotal?.classList.add('cart__sum--overlined');

      const oldSum = Number(
        cartNewSumTotal.classList.contains('cart__new-sum--visible')
          ? cartNewSumTotal.innerHTML
          : cartSumTotal?.innerHTML
      );
      const percent: number = (oldSum * newPromo.percentage) / 100;
      cartNewSumTotal.innerHTML = Math.floor(oldSum - percent).toString();
      cartNewSumTotal.classList.add('cart__new-sum--visible');
      (promoInput as HTMLInputElement).value = '';
    });
  }

  updateNumsInCart(): void {
    const [cartSumTotal, cartNumTotal] = this.getSpecifiedChildren(['#cartSumTotal', '#cartNumTotal']);

    cartSumTotal.innerHTML = getCartNumberData(CartData.totalPrice).toString();
    cartNumTotal.innerHTML = getCartNumberData(CartData.totalCount).toString();

    this.cart = getCart();
  }

  setItems(startIdx: number, number: number) {
    const main = this.getSpecifiedChild('.cart__main');

    main.innerHTML = '';
    const end: number = number <= this.cart.length - startIdx ? number : this.cart.length - startIdx;
    for (let i = startIdx; i < startIdx + end; i += 1) {
      const product: IProduct | undefined = this.products.find((y) => y.id === this.cart[i].productId);
      if (product !== undefined) {
        main.append(
          new CartItem(product, i + 1, this.cart[i].number, this.products, this.updateNumsInCart.bind(this)).element
        );
      }
    }
    const chosenPage = this.getSpecifiedChild('.cart__page--chosen');
    if (chosenPage !== null) (chosenPage as HTMLElement).classList.remove('cart__page--chosen');
  }

  setPages(select: number, pages: number) {
    const [pagesBlock] = this.getSpecifiedChildren(['.cart__pages']);

    pagesBlock.innerHTML = '';
    for (let i = 1; i <= pages; i += 1) {
      const pageBtn: HTMLElement = document.createElement('button');
      pageBtn.classList.add('cart__page');
      if (i === 1) {
        pageBtn.classList.add('cart__page--chosen');
      }
      pageBtn.addEventListener('click', () => {
        this.setItems(select * (i - 1), select);
        pageBtn.classList.add('cart__page--chosen');
      });
      pageBtn.innerHTML = i.toString();
      pagesBlock.append(pageBtn);
    }
  }

  checkPromo(promoInput: string): IPromocode | undefined {
    const error = this.getSpecifiedChild('.cart__error');

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

  deletePromocode(promocode: IPromocode) {
    const [promoAppliedTitle, cartSumTotal, cartNewSumTotal] = this.getSpecifiedChildren([
      '.cart__title-promo',
      '#cartSumTotal',
      '.cart__new-sum',
    ]);

    const promoBlock: HTMLElement[] | null = Array.from(this.element.querySelectorAll('.promocode'));

    if (promoBlock.length !== 0) {
      promoAppliedTitle.classList.remove('cart__title-promo--visible');
      const missedPromo: number = Math.floor(Number(cartSumTotal.innerHTML) / 100) * promocode.percentage;
      const newSum: number = Number(cartNewSumTotal.innerHTML) + missedPromo;
      cartNewSumTotal.innerHTML = newSum.toString();
    } else {
      promoAppliedTitle.classList.remove('cart__title-promo--visible');
      cartNewSumTotal.classList.remove('cart__new-sum--visible');
      cartSumTotal.classList.remove('cart__sum--overlined');
    }
  }
}
