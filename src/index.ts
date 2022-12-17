import { Product } from './components/product/product';
import './styles-global.scss';
import { IProduct } from './types';

const response = await fetch('https://dummyjson.com/products?limit=100');
const data = await response.json();

const mainElem = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

console.log(data);

data.products.forEach((productData: IProduct) => {
  const item = new Product(productData);
  mainElem.append(item.element);
});
