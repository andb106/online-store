import './filters.scss';
import { BaseComponent } from '../baseComponent';
import { Brand } from './brand/brand';
import { Category } from './category/category';
import { Price } from './price/price';
import { Stock } from './stock/stock';

export class Filters extends BaseComponent {
  category: Category;
  brand: Brand;
  price: Price;
  stock: Stock;

  constructor(
    dataCategory: string[],
    dataBrand: string[],
    callbackPrice: (values: (string | number)[]) => void,
    callbackStock: (values: (string | number)[]) => void
  ) {
    super('div', 'filters');
    this.category = new Category(dataCategory);
    this.brand = new Brand(dataBrand);
    this.price = new Price(callbackPrice);
    this.stock = new Stock(callbackStock);

    this.element.append(this.category.element);
    this.element.append(this.brand.element);
    this.element.append(this.price.element);
    this.element.append(this.stock.element);
  }
}
