
import { IProduct } from "../types";

// модул католог товара для корзину

export interface IBasketCatalog {
  catalog: IProduct[];
  setItems(items: IProduct[]): void; // чтобы установть после загрузки из апи
  getProduct(id: string): IProduct; // чтобы получить при рендере списков
}

export class BasketCatalogModel implements IBasketCatalog {
  catalog: IProduct[] = [];
  static getProduct: (id: string) => IProduct;
  setItems(items: IProduct[]): void {
    this.catalog = items;
  }

  getProduct(id: string): IProduct | undefined {
    return this.catalog.find(item => item.id === id);

  }
  getTotal(): number {
    return this.catalog.reduce((total, product) => total + Number(product.price), 0);

  }
}

