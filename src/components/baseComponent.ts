export class BaseComponent {
  readonly element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', style: string) {
    this.element = document.createElement(tag);
    this.element.className = style;
  }
}
