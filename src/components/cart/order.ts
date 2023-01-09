import { BaseComponent } from './../baseComponent';

export class OrderModal extends BaseComponent {
  constructor() {
    super('div', 'order');
    this.element.innerHTML = `
      <div class="order__main">
      <h3 class="order__title">Information:</h3>
      <div class="order__info">
        <div class="order__item">
          <label class="order__header">First name last name:</label>
          <input type="text" id="nameInput" class="order__input" required/>
        </div>
        <div class="order__item">
          <label class="order__header">Phone:</label>
          <input type="text" id="phoneInput" value="+" class="order__input" required/>
        </div>
        <div class="order__item">
          <span class="order__header">Address:</span>
          <textarea type="text" rows="5" id="addressArea" class="order__input" required></textarea>
        </div>
        <div class="order__item">
          <label class="order__header">Email:</label>
          <input type="email" id="emailInput" class="order__input" required/>
        </div>
      </div>
      <h3 class="order__title">Payment:</h3>
      <div class="order__payment">
        <div>
          <div class="order__item">
            <label class="order__header">Card number:</lab>
            <input type="text" id="cardInput" class="order__input" required/>
        </div>
        <div class="order__cards">
          <img class="order__img order__american-express"/>
          <img class="order__img order__unionpay"/>
          <img class="order__img order__visa"/>
        </div>
      </div>
        <div class="order__item">
          <label class="order__header">Expiry date:</label>
          <input type="text" class="order__input" id="dateInput" required/>
        </div>
        <div class="order__item">
          <label class="order__header">CVV:</label>
          <input type="text" class="order__input" id="cvvInput" required/>
        </div>
        </div>
        <button class="btn order__btn" id="btnOrder">Order</button>
      </form>
      <h2 class="order__message">Successfully ordered! Thank you!</h2>
      `;
    this.setValidators();
  }

  setValidators() {
    const [
      nameInput,
      phoneInput,
      addressArea,
      emailInput,
      cardInput,
      americanExpressImg,
      unionPayImg,
      visaImg,
      cvvInput,
      btnOrder,
      message,
      dateInput,
    ] = this.getSpecifiedChildren([
      '#nameInput',
      '#phoneInput',
      '#addressArea',
      '#emailInput',
      '#cardInput',
      '.order__american-express',
      '.order__unionpay',
      '.order__visa',
      '#cvvInput',
      '#btnOrder',
      '.order__message',
      '#dateInput',
    ]);

    nameInput.addEventListener('input', () => {
      const name: string[] = (nameInput as HTMLInputElement).value.split(' ');
      this.validateString(nameInput, name, 2, 3);
    });

    phoneInput.addEventListener('input', () => {
      const phone: string[] = (phoneInput as HTMLInputElement).value.split('+')[1].split('');
      this.validateNumber(phoneInput, phone, 9);
    });

    addressArea.addEventListener('input', () => {
      const address: string[] = (addressArea as HTMLTextAreaElement).value.trim().split(' ');
      this.validateString(addressArea, address, 3, 5);
    });

    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('order__input--error');

      const isEmailValid: boolean = (emailInput as HTMLInputElement).validity.valid;

      if (!isEmailValid) emailInput.classList.add('order__input--error');
    });

    cardInput.addEventListener('input', () => {
      [americanExpressImg, visaImg, unionPayImg].forEach((x) => x.classList.remove('order__img--chosen'));

      const card: string[] = (cardInput as HTMLInputElement).value.split('').filter((x) => x !== ' ');

      this.validateNumber(cardInput, card, 16);

      switch (card[0]) {
        case '3':
          americanExpressImg.classList.add('order__img--chosen');
          break;
        case '4':
          visaImg.classList.add('order__img--chosen');
          break;
        case '6':
          unionPayImg.classList.add('order__img--chosen');
          break;
      }
    });

    dateInput.addEventListener('input', () => {
      const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      dateInput.classList.remove('order__input--error');

      const date: string[] = (dateInput as HTMLInputElement).value.split('');
      const dateWithoutSymbol: string[] = date.filter((x) => x !== '/');
      if (date.length === 2 && !date.includes('/')) (dateInput as HTMLInputElement).value += '/';
      if (date.includes('/') && dateWithoutSymbol.length < 2)
        (dateInput as HTMLInputElement).value = dateWithoutSymbol.join('');
      if (
        dateWithoutSymbol.length !== 6 ||
        dateWithoutSymbol.some((x) => !numbers.includes(x)) ||
        Number(dateWithoutSymbol[1]) > 12
      ) {
        dateInput.classList.add('order__input--error');
      }
      if (dateWithoutSymbol.length > 6) {
        date.pop();
        (dateInput as HTMLInputElement).value = date.join('');
      }
    });

    cvvInput.addEventListener('input', () => {
      const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      cvvInput.classList.remove('order__input--error');
      const cvv: string[] = (cvvInput as HTMLInputElement).value.split('');

      if (cvv.length !== 3 || cvv.some((x) => !numbers.includes(x))) {
        cvvInput.classList.add('order__input--error');
      }
      if (cvv.length > 3) {
        cvv.pop();
        (cvvInput as HTMLInputElement).value = cvv.join('');
      }
    });

    btnOrder.addEventListener('click', () => {
      const wrongInputs: HTMLElement[] = Array.from(this.element.querySelectorAll('.order__input--error'));
      if (wrongInputs.length === 0) {
        message.classList.add('order__message--visible');
        setTimeout(() => {
          localStorage.clear();
          window.location.pathname = '/';
        }, 3000);
      }
    });
  }

  validateNumber(input: HTMLElement, value: string[], minLength: number) {
    const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    input.classList.remove('order__input--error');
    if (value.length < minLength || value.some((x) => !numbers.includes(x))) {
      input.classList.add('order__input--error');
    }
  }

  validateString(input: HTMLElement, value: string[], minLength: number, minLengthSymbol: number) {
    input.classList.remove('order__input--error');

    if (value.length < minLength || value.some((x) => x.length < minLengthSymbol) || value.some((x) => x === '')) {
      input.classList.add('order__input--error');
    }
  }
}
