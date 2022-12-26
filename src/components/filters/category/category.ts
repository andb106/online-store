import { BaseComponent } from '../../baseComponent';

export class Category extends BaseComponent {
  constructor(data: string[]) {
    super('div', 'category');
    this.addItems(data);
  }

  addItems(data: string[]) {
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = 'Category';
    this.element.append(title.element);

    const list = new BaseComponent('div', 'filter-list');
    this.element.append(list.element);

    data.forEach((category) => {
      const checkboxItem = new BaseComponent('div', 'checkboxItem');
      checkboxItem.element.innerHTML = `
      <input type="checkbox" id="${category}" />
      <label for="${category}">${category}</label>
      <span>??/5</span>
      `;
      list.element.append(checkboxItem.element);
    });

    this.element.append(list.element);
  }
}
