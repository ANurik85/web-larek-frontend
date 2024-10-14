
import { IProduct } from "../types";
import { IBasketModel } from "./BasketModel";

// модул католог товара для корзину

export interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void; // чтобы установть после загрузки из апи
  getProduct(id: string): IProduct; // чтобы получить при рендере списков
}

export class CatalogModel implements ICatalogModel {
  items: IProduct[] = [];
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getProduct(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);


  }
}

