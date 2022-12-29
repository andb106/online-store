import './filters.scss';
import { BaseComponent } from '../baseComponent';
import { Brand } from './brand/brand';
import { Category } from './category/category';
import { Price } from './price/price';

export class Filters extends BaseComponent {
  category: Category;
  brand: Brand;
  price: Price;

  constructor(dataCategory: string[], dataBrand: string[], callbackPrice: (values: (string | number)[]) => void) {
    super('div', 'filters');
    this.category = new Category(dataCategory);
    this.brand = new Brand(dataBrand);
    // this.price = new Price((values) => console.log('dual-slider on update', values));
    this.price = new Price(callbackPrice);
    this.element.append(this.category.element);
    this.element.append(this.brand.element);
    this.element.append(this.price.element);
  }
}
