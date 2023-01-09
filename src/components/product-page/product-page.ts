import { IProduct } from '../../types/index';
import { BaseComponent } from '../baseComponent';
import { addToCart, checkProductInCart, changeCartBtn, openCart } from '../../utils/db';
import './product-page.scss';

export class ProductPage extends BaseComponent {
  constructor(data: IProduct, products: IProduct[]) {
    super('div', 'item');
    this.element.innerHTML = `
        <p class="item__breadcrumbs">
          Главная / ${data.category} / ${data.brand} / ${data.title}
        </p>
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
              <p class="item__info-one">Category: ${data.category}</p>
              <p class="item__info-one">Brand: ${data.brand}</p>
              <p class="item__info-one">${data.stock} pieces left in stock</p>
              <p class="item__info-one">Rating: ${data.rating}/5</p>
              <div class="item__sum">
                <span class="item__price">${data.price}$</span>
                <span class="item__discount">${data.discountPercentage}%</span>
              </div>
            </div>
            <p class="item__description">${data.description}</p>
          </div>
        </div>
        <div class="item__controls">
          <button class="btn item__cart">Add to cart</button>
          <button class="btn item__buy">Buy</button>
        </div>
        <div class="item__modal">
          <img src="${data.images[0]}" alt="${data.title}" id="itemModalImg" />
        </div>
    `;
    const images: HTMLElement[] = Array.from(this.element.querySelectorAll('.item__img--small'));
    const mainImg: HTMLElement | null = this.element.querySelector('#itemMainImg');
    const modal: HTMLElement | null = this.element.querySelector('.item__modal');
    const modalImg: HTMLElement | null = this.element.querySelector('#itemModalImg');
    if (mainImg !== null && modalImg !== null && modal !== null) {
      this.setImageChange(images, mainImg, data);
      this.setModal(mainImg, modalImg, modal);
    }
    const btnCart: HTMLElement | null = this.element.querySelector('.item__cart');
    if (btnCart !== null) {
      if (!checkProductInCart(data.id)) {
        btnCart.addEventListener('click', function () {
          addToCart(data.id, 1, data.price);
          changeCartBtn(btnCart);
        });
      } else {
        changeCartBtn(btnCart);
      }
    }

    const btnOrder: HTMLElement | null = this.element.querySelector('.item__buy');
    btnOrder?.addEventListener('click', () => {
      if (!checkProductInCart(data.id)) addToCart(data.id, 1, data.price);
      openCart(true, products);
    });
  }

  setImageChange(images: HTMLElement[], mainImg: HTMLElement, data: IProduct) {
    images.forEach((x) =>
      x.addEventListener('click', function () {
        const newIdx: number = images.indexOf(x) === 2 ? 3 : (images.indexOf(x) + 1) % 3;
        mainImg.setAttribute('src', data.images[newIdx]);
      })
    );
  }

  setModal(mainImg: HTMLElement, modalImg: HTMLElement, modal: HTMLElement) {
    mainImg.addEventListener('click', function () {
      const imgPath: string | null = mainImg.getAttribute('src');
      imgPath !== null ? modalImg.setAttribute('src', imgPath) : null;
      modal.classList.add('item__modal--visible');
    });
    modal.addEventListener('click', function () {
      modal.classList.remove('item__modal--visible');
    });
  }
}
