import { BaseComponent } from '../baseComponent';

export class CheckBoxFilter extends BaseComponent {
  constructor(data: string[], caption: string) {
    super('div', caption.toLowerCase());
    this.addItems(data, caption);
  }

  addItems(data: string[], caption: string) {
    const title = new BaseComponent('h3', 'filter-title');
    title.element.textContent = caption;
    this.element.append(title.element);

    const list = new BaseComponent('div', 'filter-list');
    this.element.append(list.element);

    data.forEach((item) => {
      const checkboxItem = new BaseComponent('div', 'checkboxItem');
      checkboxItem.element.innerHTML = `
      <input type="checkbox" id="${item}" />
      <label for="${item}">${item}</label>
      <span>??/5</span>
      `;
      list.element.append(checkboxItem.element);
    });

    this.element.append(list.element);
  }
}
