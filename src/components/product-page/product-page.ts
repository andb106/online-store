import { ICartItem } from './../../types/index';
import { IProduct } from '../../types/index';
import { BaseComponent } from '../baseComponent';
import './product-page.scss';

export class ProductPage extends BaseComponent {
  id: number;
  constructor(data: IProduct) {
    super('div', 'item');
    this.id = data.id;
    this.element.innerHTML = `
        <div class="item__main">
          <div class="item__photos">
            <div class="item__add-photos">
              <img src="${data.images[1]}" alt="${data.title}" class="item__img item__img--small" />
              <img src="${data.images[2]}" alt="${data.title}" class="product__img item__img--small" />
              <img src="${data.images[3]}" alt="${data.title}" class="item__img item__img--small" />
            </div>
            <img src="${data.images[0]}" alt="${data.title}" class="item__img" id="itemMainImg" />
          </div>
          <div class="item__text">
            <div class="item__info">
              <h3 class="item__title">${data.title}</h3>
              <p class="item__category">Категория: ${data.category}</p>
              <span class="item__price">${data.price}$</span>
            </div>
            <p class="item__description">${data.description}</p>
          </div>
        </div>
        <div class="item__controls">
          <button class="btn item__cart">В КОРЗИНУ</button>
          <button class="btn item__buy">КУПИТЬ</button>
        </div>
        <div class="item__modal">
          <img src="${data.images[0]}" alt="${data.title}" id="itemModalImg" />
        </div>
    `;
    const images: HTMLElement[] = Array.from(this.element.querySelectorAll('.item__img--small'));
    const mainImg: HTMLElement | null = this.element.querySelector('#itemMainImg');
    images.forEach((x) =>
      x.addEventListener('click', function () {
        if (mainImg !== null) {
          const newIdx: number = images.indexOf(x) === 2 ? 3 : (images.indexOf(x) + 1) % 3;
          mainImg.setAttribute('src', data.images[newIdx]);
        }
      })
    );
    const modal: HTMLElement | null = this.element.querySelector('.item__modal');
    const modalImg: HTMLElement | null = this.element.querySelector('#itemModalImg');
    mainImg?.addEventListener('click', function () {
      const imgPath: string | null = mainImg.getAttribute('src');
      imgPath !== null ? modalImg?.setAttribute('src', imgPath) : null;
      modal?.classList.add('item__modal--visible');
    });
    modal?.addEventListener('click', function () {
      modal?.classList.remove('item__modal--visible');
    });
    const btnCart: HTMLElement | null = this.element.querySelector('.item__cart');
    btnCart?.addEventListener('click', function () {
      let cartArr: ICartItem[] | ICartItem = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cartArr)) {
        cartArr.productId === data.id
          ? (cartArr.number += 1)
          : (cartArr = [
              cartArr,
              {
                productId: data.id,
                number: 1,
              },
            ]);
      } else if (Array.isArray(cartArr)) {
        const existedIdx: number = cartArr.findIndex((x) => x.productId === data.id);
        existedIdx !== -1
          ? (cartArr[existedIdx].number += 1)
          : cartArr.push({
              productId: data.id,
              number: 1,
            });
      }
      localStorage.setItem('cart', JSON.stringify(cartArr));
      const sum: number = Number(localStorage.getItem('sum') || '0') + 1;
      localStorage.setItem('sum', sum.toString());
    });
  }
}
