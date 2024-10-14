import { Component } from "././base/Component";
import { cloneTemplate, createElement, ensureElement, formatNumber } from ".././utils/utils";
import { EventEmitter } from "././base/events";
import { ICard, ICardsData } from "../types";
import { CardsData } from "./CardsData";

// класс отображение, и реализация отдельного товара в корзину
interface IViewConstructor {
  new(container: HTMLElement, events?: EventEmitter): IView; // на входе контейнер, в него будем выводить
}
interface IView {
  render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}

export class BasketItemView implements IView {
  items: any[] = [];
  // элементы внутри контейнера
  protected title: HTMLElement;
  protected addButton: HTMLButtonElement;
  protected removeButton: HTMLButtonElement;
  // данные, которое хотим сохранить на будущее
  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    this.title = container.querySelector('basket-item__title') as HTMLSpanElement;
    this.addButton = container.querySelector('basket-item__add') as HTMLButtonElement;
    this.removeButton = container.querySelector('basket-item__remove') as HTMLButtonElement;
    // устанавливаем события

    // this.addButton.addEventListener('click', () => {
    //   // генерируем событие в нашем брокере
    //   this.events.emit('basket:add', { id: this.id });
    // });

    this.removeButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }
  render(data: { id: string, title: string }) {
    if (data) {
      // если есть новое данные, то запомним их
      this.id = data.id;
      // и выведем в интерфейс
      this.title.textContent = data.title;
    }

    return this.container;
  }
}


// корзина товара
export class BasketView implements IView {
  constructor(protected container: HTMLElement) { }

  render(data: { items: HTMLElement[] }) {
    if (data) {
      this.container.replaceChildren(...data.items);
    }
    return this.container;
  }
}
