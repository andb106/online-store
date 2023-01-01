import './filters.scss';
import { BaseComponent } from '../baseComponent';
import { CheckBoxFilter } from './checkBox';
import { SliderCallBack, SliderOptions } from '../../types';
import { Slider } from './slider';

export class Filters extends BaseComponent {
  filters: Array<CheckBoxFilter | Slider>;

  constructor(
    dataCategory: string[],
    dataBrand: string[],
    callbackPrice: SliderCallBack,
    callbackStock: SliderCallBack
  ) {
    super('div', 'filters');

    const priceOptions: SliderOptions = {
      caption: 'Price',
      min: 10,
      max: 1749,
      callback: callbackPrice,
    };
    const stockOptions: SliderOptions = {
      caption: 'Stock',
      min: 2,
      max: 150,
      callback: callbackStock,
    };

    this.filters = [
      new CheckBoxFilter(dataCategory, 'Category'),
      new CheckBoxFilter(dataBrand, 'Brand'),
      new Slider(priceOptions),
      new Slider(stockOptions),
    ];

    this.filters.forEach(({ element }) => this.element.append(element));
  }
}
