import './filters.scss';
import { BaseComponent } from '../baseComponent';
import { Price } from './price/price';
import { Stock } from './stock/stock';
import { CheckBoxFilter } from './checkBox';

export class Filters extends BaseComponent {
  category: CheckBoxFilter;
  brand: CheckBoxFilter;
  price: Price;
  stock: Stock;

  constructor(
    dataCategory: string[],
    dataBrand: string[],
    callbackPrice: (values: (string | number)[]) => void,
    callbackStock: (values: (string | number)[]) => void
  ) {
    super('div', 'filters');
    this.category = new CheckBoxFilter(dataCategory, 'Category');
    this.brand = new CheckBoxFilter(dataBrand, 'Brand');
    this.price = new Price(callbackPrice);
    this.stock = new Stock(callbackStock);

    this.element.append(this.category.element);
    this.element.append(this.brand.element);
    this.element.append(this.price.element);
    this.element.append(this.stock.element);
  }
}
