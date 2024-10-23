import { EventEmitter } from "././base/events";
export interface IView {
  render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}

export class BasketItemView implements IView {
  // элементы внутри контейнера
  title: HTMLSpanElement;
  price: HTMLSpanElement;
  protected removeButton: HTMLButtonElement;
  protected indexNumber: HTMLSpanElement;
  // данные, которое хотим сохранить на будущее
  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    this.indexNumber = container.querySelector('.basket__item-index') as HTMLSpanElement;
    this.title = container.querySelector('.card__title') as HTMLSpanElement;
    this.price = container.querySelector('.card__price') as HTMLSpanElement;
    this.removeButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    // устанавливаем события
    this.removeButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });

  }

  // Метод для получения значения id
  getId(): string | null {
    return this.id;
  }
  getTitle(): string {
    return this.title.textContent;
  }

  getPrice(): string {
    return this.price.textContent;
  }

  // Метод для получения элемента
  getElement(): HTMLElement {
    return this.container;
  }

  // Метод для установки порядкового номера
  setIndexNumber(number: number) {
    this.indexNumber.textContent = `${number}`;
  }

  render(data: { id: string, indexNumber: number, title: string, price: string }) {
    if (data) {
      // если есть новое данные, то запомним их
      this.id = data.id;
      this.indexNumber.textContent = `${data.indexNumber}`;
      // и выведем в интерфейс
      this.title.textContent = data.title;
      this.price.textContent = (data.price === null) ? 'безценно' : `${data.price} синапсов`;
    }
    return this.container;
  }
}

