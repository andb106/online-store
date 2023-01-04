import { BaseComponent } from '../baseComponent';

export class Search extends BaseComponent {
  constructor(callback: (value: string) => void) {
    super('div', 'search');
    const searchInput = new BaseComponent('input', 'search-input').element as HTMLInputElement;
    searchInput.placeholder = 'search product';
    searchInput.oninput = () => {
      callback(searchInput.value.trim());
    };
    this.element.append(searchInput);
  }

  resetInput() {
    const input = this.element.firstChild as HTMLInputElement;
    input.value = '';
  }

  updateInput(value: string) {
    const input = this.element.firstChild as HTMLInputElement;
    input.value = value;
  }
}
