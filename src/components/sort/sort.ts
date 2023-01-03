import { BaseComponent } from '../baseComponent';

export class Sort extends BaseComponent {
  selectElem: HTMLSelectElement;

  constructor() {
    super('div', 'sort');
    const select = new BaseComponent('select', 'sort-select');
    select.element.innerHTML = `
      <option disabled selected value>select sorting:</option>
      <option value=1>price from min</option>
      <option value=2>price from max</option>
      <option value=3>rating from min</option>
      <option value=4>rating from max</option>
    `;
    const selectElem = select.element as HTMLSelectElement;
    this.selectElem = selectElem;
    this.element.append(selectElem);
  }
}
