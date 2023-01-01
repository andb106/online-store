import './slider.scss';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { BaseComponent } from '../baseComponent';
import { SliderOptions } from '../../types';

export class Slider extends BaseComponent {
  slider: noUiSlider.API | null;
  constructor(options: SliderOptions) {
    super('div', options.caption.toLowerCase());
    this.slider = null;
    this.addItems(options);
  }

  addItems(options: SliderOptions) {
    const { min, max, callback, caption } = options;
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = caption;
    this.element.append(title.element);

    const slider = new BaseComponent('div', 'slider');
    slider.element.setAttribute('id', 'slider-round');

    const dualSlider = noUiSlider.create(slider.element, {
      start: [min, max],
      connect: true,
      step: 1,
      range: {
        min,
        max,
      },
      tooltips: {
        to: function (numericValue) {
          return numericValue.toFixed(0);
        },
      },
    });

    dualSlider.on('change', callback);

    this.slider = dualSlider;
    this.element.append(slider.element);
  }
}
