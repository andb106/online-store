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
  hasClass(token: string) {
    return this.element.classList.contains(token);
  }

  addClass(...tokens: string[]) {
    this.element.classList.add(...tokens);
  }

  removeClass(...tokens: string[]) {
    this.element.classList.remove(...tokens);
  }

  append(...components: BaseComponent[]) {
    this.element.append(...components.map((el) => el.element));
  }
}
