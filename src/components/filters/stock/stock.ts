import './stock.scss';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { BaseComponent } from '../../baseComponent';

export class Stock extends BaseComponent {
  constructor(callbackStock: (values: (string | number)[]) => void) {
    super('div', 'stock');
    this.addItems(callbackStock);
  }

  addItems(dualSliderCallback: (values: (string | number)[]) => void) {
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = 'Stock';
    this.element.append(title.element);

    const slider = new BaseComponent('div', 'slider');
    slider.element.setAttribute('id', 'slider-round');

    const dualSlider = noUiSlider.create(slider.element, {
      start: [2, 150],
      connect: true,
      step: 1,
      range: {
        min: 2,
        max: 150,
      },
      // tooltips: true,
      tooltips: {
        // tooltips are output only, so only a "to" is needed
        to: function (numericValue) {
          return numericValue.toFixed(0);
        },
      },
    });

    // dualSlider.on('update', (values) => console.log('dual slider values', values));
    dualSlider.on('change', dualSliderCallback);

    this.element.append(slider.element);
  }
}
