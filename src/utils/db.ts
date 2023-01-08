import { ICartItem } from '../types';

export function addToCart(id: number, num: number, price: number) {
  const cartArr: ICartItem[] = JSON.parse(localStorage.getItem('uliara_cart') || '[]');
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

  window.dispatchEvent(new Event('storage'));
}

export function checkProductInCart(id: number): boolean {
  const cartArr: ICartItem[] = JSON.parse(localStorage.getItem('uliara_cart') || '[]');
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

export function removeFromCart(id: number, price: number) {
  const cartArr: ICartItem[] = JSON.parse(localStorage.getItem('uliara_cart') || '[]');
  const existedIdx: number = cartArr.findIndex((x) => x.productId === id);

  const numCurrentProduct = cartArr[existedIdx].number;
  const sumCurrentProduct = numCurrentProduct * price;

  const newSum = Number(localStorage.getItem('uliara_sum') || '0') - sumCurrentProduct;
  const newNumCart = Number(localStorage.getItem('uliara_num') || '0') - numCurrentProduct;
  const newCartArr = cartArr.filter((x) => x.productId !== id);

  localStorage.setItem('uliara_cart', JSON.stringify(newCartArr));
  localStorage.setItem('uliara_sum', newSum.toString());
  localStorage.setItem('uliara_num', newNumCart.toString());

  window.dispatchEvent(new Event('storage'));
}
