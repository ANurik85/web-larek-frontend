import { ICard } from "../types";

export interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  getItems(): { id: string, quantity: number }[]
}

interface EventEmitter {
  emit: (event: string, data: unknown) => void;
}

export class BasketModel implements IBasketModel {
  items: Map<string, number> = new Map();
  constructor(protected events: EventEmitter) { }

  add(id: string): void {
    if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
    this.items.set(id, this.items.get(id)! + 1); // прибавляем количество

    this._changed();
  }



  remove(id: string): void {
    if (!this.items.has(id)) return; // если нет, то и делать с ним нечево
    if (this.items.get(id)! > 0) { // если есть и больше ноля, то... 
      this.items.set(id, this.items.get(id)! - 1); // уменьшаем 
      if (this.items.get(id) === 0) this.items.delete(id); // если опустили до ноля, то удаляем
    }

    this._changed();
  }

  getItems(): { id: string, quantity: number }[] {
    return Array.from(this.items.entries()).map(([id, quantity]) => ({ id, quantity }));
  }

  protected _changed(): void {
    this.events.emit('basket:change', { item: Array.from(this.items.keys()) });
  }
}

