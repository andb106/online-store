import './price.scss';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { BaseComponent } from '../../baseComponent';

export class Price extends BaseComponent {
  constructor() {
    super('div', 'price');
    this.addItems();
  }

  addItems() {
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = 'Price';
    this.element.append(title.element);

    const slider = new BaseComponent('div', 'slider');
    slider.element.setAttribute('id', 'slider-round');

    const dualSlider = noUiSlider.create(slider.element, {
      start: [200, 800],
      connect: true,
      step: 1,
      range: {
        min: 0,
        max: 1000,
      },
      // tooltips: true,
      tooltips: {
        // tooltips are output only, so only a "to" is needed
        to: function (numericValue) {
          return numericValue.toFixed(0);
        },
      },
    });

    dualSlider.on('update', (values) => console.log('dual slider values', values));

    this.element.append(slider.element);
  }
}
