import { IProduct, IPromocode } from './../types/index';
import { ICartItem } from '../types';
import { CartPage } from '../components/cart/cart-page';

export function addToCart(id: number, num: number, price: number) {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === id);
  existedIdx !== -1
    ? (cartArr[existedIdx].number += 1)
    : cartArr.push({
        productId: id,
        number: num,
      });
  localStorage.setItem('uliara_cart', JSON.stringify(cartArr));
  const sum: number = Number(localStorage.getItem('uliara_sum') || '0') + num * price;
  localStorage.setItem('uliara_sum', sum.toString());
  const numCart: number = Number(localStorage.getItem('uliara_num') || '0') + num;
  localStorage.setItem('uliara_num', numCart.toString());
}

export function removeOneFromCart(id: number, newNum: number, price: number) {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === id);
  cartArr[existedIdx].number = newNum;
  localStorage.setItem('uliara_cart', JSON.stringify(cartArr));
  const sum: number = Number(localStorage.getItem('uliara_sum') || '0') - price;
  localStorage.setItem('uliara_sum', sum.toString());
  const numCart: number = Number(localStorage.getItem('uliara_num') || '0') - 1;
  localStorage.setItem('uliara_num', numCart.toString());
}

export function removeItemFromCart(id: number, num: number, price: number, products: IProduct[]) {
  let cartArr: ICartItem[] = getCart();
  cartArr = cartArr.filter((x) => x.productId !== id);
  localStorage.setItem('uliara_cart', JSON.stringify(cartArr));
  const sum: number = Number(localStorage.getItem('uliara_sum') || '0') - num * price;
  localStorage.setItem('uliara_sum', sum.toString());
  const numCart: number = Number(localStorage.getItem('uliara_num') || '0') - num;
  localStorage.setItem('uliara_num', numCart.toString());
  const mainElem: HTMLElement | null = document.querySelector('.main');
  if (mainElem !== null) {
    mainElem.innerHTML = '';
    mainElem.append(new CartPage(products, getCart()).element);
  }
}

export function updateNumsInCart(cartNumTotal?: Element | null, cartSumTotal?: Element | null): void {
  const sum: string = localStorage.getItem('uliara_sum') || '0';
  const numCart: string = localStorage.getItem('uliara_num') || '0';
  if (cartNumTotal === undefined) {
    cartNumTotal = document.querySelector('#cartNumTotal');
  }
  if (cartSumTotal === undefined) {
    cartSumTotal = document.querySelector('#cartSumTotal');
  }
  if (cartNumTotal !== null && cartSumTotal !== null) {
    cartNumTotal.innerHTML = numCart;
    cartSumTotal.innerHTML = sum;
  }
}

export function checkProductInCart(id: number): boolean {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === id);
  if (existedIdx === -1) {
    return false;
  }
  return true;
}

export function changeCartBtn(btnCart: HTMLElement) {
  btnCart.innerHTML = 'ДОБАВЛЕН';
  btnCart.classList.add('btn--disabled');
}

export function getCart(): ICartItem[] {
  return JSON.parse(localStorage.getItem('uliara_cart') || '[]');
}

export function addMoreToCart(data: IProduct, num: number): boolean {
  if (data.stock > num) {
    addToCart(data.id, 1, data.price);
    updateNumsInCart();
    return true;
  }
  return false;
}

export function removeFromCart(data: IProduct, num: number, products: IProduct[]): boolean {
  if (num - 1 === 0) {
    removeItemFromCart(data.id, num, data.price, products);
    updateNumsInCart();
    return false;
  } else {
    removeOneFromCart(data.id, num - 1, data.price);
    updateNumsInCart();
    return true;
  }
}

export function deletePromocode(promocode: IPromocode, element: HTMLElement) {
  element.remove();
  const cartSumTotal: HTMLElement | null = document.querySelector('#cartSumTotal');
  const cartNewSumTotal: HTMLElement | null = document.querySelector('.cart__new-sum');
  const promoBlock: HTMLElement[] | null = Array.from(document.querySelectorAll('.promocode'));
  const promoAppliedTitle: HTMLElement | null = document.querySelector('.cart__title-promo');
  if (promoBlock !== null && promoBlock.length !== 0 && cartNewSumTotal !== null) {
    promoAppliedTitle?.classList.remove('cart__title-promo--visible');
    const missedPromo: number = Math.floor(Number(cartSumTotal?.innerHTML) / 100) * promocode.percentage;
    const newSum: number = Number(cartNewSumTotal.innerHTML) + missedPromo;
    cartNewSumTotal.innerHTML = newSum.toString();
  } else if (promoBlock.length === 0) {
    promoAppliedTitle?.classList.remove('cart__title-promo--visible');
    cartNewSumTotal?.classList.remove('cart__new-sum--visible');
    cartSumTotal?.classList.remove('cart__sum--overlined');
  }
}
