import { IProduct } from './../types/index';
import { ICartItem } from '../types';
import { CartPage } from '../components/cart/cart-page';

export const enum CartData {
  cart = 'uliara_cart',
  totalPrice = 'uliara_sum',
  totalCount = 'uliara_num',
}

export function getCart(): ICartItem[] {
  return JSON.parse(localStorage.getItem(CartData.cart) || '[]');
}

function setCartData(type: CartData, value: unknown) {
  localStorage.setItem(type, JSON.stringify(value));
}

export function getCartNumberData(type: CartData, defaultValue = '0') {
  return Number(localStorage.getItem(type) || defaultValue);
}

export function addToCart(productId: number, number: number, price: number) {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === productId);

  existedIdx !== -1
    ? (cartArr[existedIdx].number += 1)
    : cartArr.push({
        productId,
        number,
      });
  const totalPrice: number = getCartNumberData(CartData.totalPrice) + number * price;
  const totalCount: number = getCartNumberData(CartData.totalCount) + number;

  setCartData(CartData.totalPrice, totalPrice);
  setCartData(CartData.totalCount, totalCount);
  setCartData(CartData.cart, cartArr);
}

export function removeOneFromCart(productId: number, newNum: number, price: number) {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === productId);
  cartArr[existedIdx].number = newNum;

  const sum: number = getCartNumberData(CartData.totalPrice) - price;
  const numCart: number = getCartNumberData(CartData.totalCount) - 1;

  setCartData(CartData.cart, cartArr);
  setCartData(CartData.totalPrice, sum);
  setCartData(CartData.totalCount, numCart);
}

export function removeItemFromCart(productId: number, number: number, price: number, products: IProduct[]) {
  let cartArr: ICartItem[] = getCart();
  cartArr = cartArr.filter((x) => x.productId !== productId);

  const sum: number = getCartNumberData(CartData.totalPrice) - number * price;
  const numCart: number = getCartNumberData(CartData.totalCount) - number;

  setCartData(CartData.cart, cartArr);
  setCartData(CartData.totalPrice, sum);
  setCartData(CartData.totalCount, numCart);

  const mainElem: HTMLElement | null = document.querySelector('.main');
  if (mainElem !== null) {
    mainElem.innerHTML = '';
    mainElem.append(new CartPage(products, getCart()).element);
  }
}

export function checkProductInCart(productId: number): boolean {
  const cartArr: ICartItem[] = getCart();
  const existedIdx: number = cartArr.findIndex((x) => x.productId === productId);
  if (existedIdx === -1) {
    return false;
  }
  return true;
}

export function changeCartBtn(btnCart: HTMLElement) {
  btnCart.innerHTML = 'ДОБАВЛЕН';
  btnCart.classList.add('btn--disabled');
}

export function addMoreToCart(data: IProduct, num: number): boolean {
  if (data.stock > num) {
    addToCart(data.id, 1, data.price);
    return true;
  }
  return false;
}

export function removeFromCart(data: IProduct, num: number, products: IProduct[]): boolean {
  if (num - 1 === 0) {
    removeItemFromCart(data.id, num, data.price, products);
    return false;
  } else {
    removeOneFromCart(data.id, num - 1, data.price);
    return true;
  }
}
