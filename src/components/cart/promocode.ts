import { IPromocode } from './../../types/index';
import { BaseComponent } from './../baseComponent';
import '../cart/cart.scss';
import { deletePromocode } from '../../utils/db';

export class Promocode extends BaseComponent {
  promocode: IPromocode;
  constructor(promocode: IPromocode) {
    super('div', 'promocode');
    this.promocode = promocode;
    this.element.innerHTML = `
      <span class="promocode__title">${promocode.title}</span>
      <span class="promocode__percentage">${promocode.percentage}%</span>
      <button class="btn promocode__delete">Delete</button>
    `;
    const deleteBtn: HTMLElement | null = this.element.querySelector('.promocode__delete');
    if (deleteBtn !== null) {
      deleteBtn.onclick = () => {
        deletePromocode(promocode, this.element);
      };
    }
  }
}
