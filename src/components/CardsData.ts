import _ from "lodash";
import { Model } from "./base/Model";
import { ICardsData, ICard, IProduct } from "../types";


export class CardsData extends Model<ICardsData> {

  catalog: ICard[] = [];
  loading: boolean;
  preview: string | null = null;
  static getCardItem: string;

  getCardItem(id: string): IProduct | undefined {
    const card = this.catalog.find((item) => item.id === id);

    return card;
  }

  setCatalog(items: ICard[]) {

    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: ICard) {
    this.preview = item.id;
    this.emitChanges('card:select', item);
  }

  get cards(): ICard[] {
    return this.catalog;
  }
}