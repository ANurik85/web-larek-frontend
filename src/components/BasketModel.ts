import { IProduct } from "../types";
import { IEvents } from "./base/events";

export interface IBasketModel {

  basket: IProduct[];
  getItems(): { id: string, quantity: number }[]
}

export class BasketModel implements IBasketModel {

  basket: IProduct[] = [];

  constructor(protected events: IEvents) { 
  
  }

  addToBasket(item: IProduct): boolean {
    const index = this.basket.findIndex((IProduct) => IProduct.id === item.id);
    
    if (index === -1) {
      this.basket.push(item);
      this.basket = this.basket.map((item, index) => ({ ...item, indexNumber: index + 1 }));
      this.events.emit('basket:change');
      return true;
      
    } else {
      return false;
    }
  }

  removeCard(cardId: string) {
    const index = this.basket.findIndex(item => item.id === cardId);
    if (index !== -1) {
      this.basket.splice(index, 1);
      this.events.emit('basket:change');
    }
    
  }

  clearBasket(): void {
       this.basket = [];
        this.events.emit('basket:change');
  }

  getItems(): { id: string, quantity: number }[] {
    return this.basket.map((item) => ({ id: item.id, quantity: 1 }));
  }

  getItemCount(): number {
    return this.basket.length;
  }

  calculateTotal(): number {
    return this.basket.reduce((sum, item) => {
      const priceText = item.price;
      if (!isNaN(parseFloat(priceText))) {
        const price = parseFloat(priceText);
        return sum + price;
      }
      return sum; 
    }, 0);
  }
 
}
