import './productList.scss';
import { IProduct } from '../../types';
import { BaseComponent } from '../baseComponent';
import { Product } from '../product/product';

export class ProductList extends BaseComponent {
  constructor(data: IProduct[]) {
    super('div', 'product-list');
    this.addProducts(data);
  }

  addProducts(data: IProduct[]) {
    data.forEach((productData) => {
      const item = new Product(productData);
      this.element.append(item.element);
    });
  }

  updateItems(data: IProduct[]) {
    console.log('length updated data-->', data.length);
    this.element.replaceChildren();
    data.length ? this.addProducts(data) : (this.element.textContent = 'Products not found');
    console.log('update ProductList', data);
  }
}

// const renderAllProducts = (parentElem: HTMLElement) => {
//   parentElem.innerHTML = '';
//   data.products.forEach((productData: IProduct) => {
//     const item = new Product(productData, (...args) => {
//       console.log('product id', [...args][0]);
//       history.pushState(null, '', `/product/${[...args][0]}`);
//       parentElem.innerHTML = '';
//       parentElem.append(item.element);
//     });
//     parentElem.append(item.element);
//   });
// };
