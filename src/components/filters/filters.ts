import './filters.scss';
import { BaseComponent } from '../baseComponent';
import { CheckBoxFilter } from './checkBox';
import { SliderCallBack, SliderOptions } from '../../types';
import { Slider } from './slider';

export class Filters extends BaseComponent {
  checkBoxFilters: Array<CheckBoxFilter>;
  sliderFilters: Array<Slider>;

  constructor(
    dataCategory: string[],
    itemCountsCategory: number[][],
    dataBrand: string[],
    itemCountsBrand: number[][],
    minMaxPrice: number[],
    minMaxStock: number[],
    callbackPrice: SliderCallBack,
    callbackStock: SliderCallBack
  ) {
    super('div', 'filters');

    const priceOptions: SliderOptions = {
      caption: 'Price',
      min: minMaxPrice[0],
      max: minMaxPrice[1],
      callback: callbackPrice,
    };
    const stockOptions: SliderOptions = {
      caption: 'Stock',
      min: minMaxStock[0],
      max: minMaxStock[1],
      callback: callbackStock,
    };

    this.checkBoxFilters = [
      new CheckBoxFilter(dataCategory, 'Category', itemCountsCategory),
      new CheckBoxFilter(dataBrand, 'Brand', itemCountsBrand),
    ];

    this.sliderFilters = [new Slider(priceOptions), new Slider(stockOptions)];

    this.checkBoxFilters.forEach(({ element }) => this.element.append(element));
    this.sliderFilters.forEach(({ element }) => this.element.append(element));
  }
}
