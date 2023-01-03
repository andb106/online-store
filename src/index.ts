import { Product } from './components/product/product';
import { ProductPage } from './components/product-page/product-page';
import './styles-global.scss';
import { IProduct } from './types';
import Router from './utils/router';

const response = await fetch('https://dummyjson.com/products?limit=100');
const data = await response.json();

const mainElem: HTMLElement | null = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

//console.log(data);

const renderAllProducts = (parentElem: HTMLElement) => {
  parentElem.innerHTML = '';
  data.products.forEach((productData: IProduct) => {
    const item = new Product(productData, (...args) => {
      console.log('product id', [...args][0]);
      history.pushState(null, '', `/product/${[...args][0]}`);
      parentElem.innerHTML = '';
      parentElem.append(item.element);
    });
    parentElem.append(item.element);
  });
};

// renderAllProducts(mainElem);

new Router([
  {
    path: 'page 404',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = '404 page';
    },
  },
  {
    path: '/',
    view: () => {
      renderAllProducts(mainElem);
    },
  },
  {
    path: '/cart',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = 'cart page';
    },
  },
  {
    path: '/product/:id', // id - product id, but in data-array get position (id - 1) !
    view: (params) => {
      const len = data.products.length;
      mainElem.innerHTML = '';
      if (+params.id - 1 >= 0 && +params.id - 1 < len) {
        mainElem.append(new ProductPage(data.products[+params.id - 1]).element);
      } else {
        mainElem.innerHTML = `Product with id ${params.id} not found`;
      }
    },
  },
]);
