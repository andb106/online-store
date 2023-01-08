export class BaseComponent {
  readonly element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', style: string) {
    this.element = document.createElement(tag);
    this.element.className = style;
  }

  getSpecifiedChildren(selectors: string[]) {
    return selectors.map((x) => this.element.querySelector(x) as HTMLElement);
  }

  getSpecifiedChild(selector: string) {
    return this.element.querySelector(selector) as HTMLElement;
  }
}
