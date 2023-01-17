import './productList.scss';
import { IProduct } from '../../types';
import { BaseComponent } from '../baseComponent';
import { Product } from '../product/product';

export class ProductList extends BaseComponent {
  onProductDetails: (value: number) => void;
  constructor(data: IProduct[], callback: (value: number) => void) {
    super('div', 'product-list');
    this.onProductDetails = (value: number) => {
      callback(value);
    };
    this.addProducts(data);
  }

  addProducts(data: IProduct[]) {
    data.forEach((productData) => {
      const item = new Product(productData, this.onProductDetails);
      this.element.append(item.element);
    });
  }

  updateItems(data: IProduct[]) {
    this.element.replaceChildren();
    data.length ? this.addProducts(data) : (this.element.textContent = 'Products not found');
  }
}
