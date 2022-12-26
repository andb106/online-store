import { BaseComponent } from '../baseComponent';
import { Brand } from './brand/brand';
import { Category } from './category/category';

export class Filters extends BaseComponent {
  category: Category;
  brand: Brand;

  constructor(dataCategory: string[], dataBrand: string[]) {
    super('div', 'filters');
    this.category = new Category(dataCategory);
    this.brand = new Brand(dataBrand);
    this.element.append(this.category.element);
    this.element.append(this.brand.element);
  }
}
