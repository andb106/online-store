export class BaseComponent {
  readonly element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', style: string) {
    this.element = document.createElement(tag);
    this.element.className = style;
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
