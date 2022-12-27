import { BaseComponent } from '../../baseComponent';

export class Brand extends BaseComponent {
  constructor(data: string[]) {
    super('div', 'brand');
    this.addItems(data);
  }

  addItems(data: string[]) {
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = 'Brand';
    this.element.append(title.element);

    const list = new BaseComponent('div', 'filter-list');
    this.element.append(list.element);

    data.forEach((brand) => {
      const checkboxItem = new BaseComponent('div', 'checkboxItem');
      checkboxItem.element.innerHTML = `
      <input type="checkbox" id="${brand}" />
      <label for="${brand}">${brand}</label>
      <span>?/?</span>
      `;
      list.element.append(checkboxItem.element);
    });

    this.element.append(list.element);
  }
}
