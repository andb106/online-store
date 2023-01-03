import { BaseComponent } from '../baseComponent';

export class CheckBoxFilter extends BaseComponent {
  list: HTMLElement | null;
  constructor(data: string[], caption: string, itemCounts: number[][]) {
    super('div', caption.toLowerCase());
    this.list = null;
    this.addItems(data, caption);
    this.updateList(itemCounts);
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
    this.list = list.element;
    this.element.append(list.element);
  }

  updateList(itemCounts: number[][]) {
    if (this.list) {
      [...this.list.children].forEach((item, i) => {
        const spanElem = item.lastElementChild as HTMLSpanElement;
        spanElem.textContent = `${itemCounts[i][0]}/${itemCounts[i][1]}`;

        // const checkboxElem = item.firstElementChild as HTMLInputElement;
        // checkboxElem.checked = true;
      });
    }
  }

  resetChecked() {
    if (this.list) {
      [...this.list.children].forEach((item) => {
        const checkboxElem = item.firstElementChild as HTMLInputElement;
        checkboxElem.checked = false;
      });
    }
  }
}
