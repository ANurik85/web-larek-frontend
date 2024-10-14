
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
export interface IProduct {
  price?: number;
  id: string;
  title: string;
  index?: string;
}

export interface ICardsData {
  catalog: ICard[];
  
  preview: string | null;
  order: IOrder;
  loading: boolean;
  cardId: string;
  getCardItem(id: string): ICard | undefined;
  setCatalog(items: ICard[]): void;
  setPreview(item: ICard[]): void;
  addToBasket(cardId: IProduct): void;
}


export interface IFormContacts {
  email: string;
  phone: string;
}

export interface IFormAddress {
  address: string;
  paymentMethod: string;

}

export interface IOrder {
  items: string[]
}

export type FormErrors = Partial<Record<keyof (IFormAddress & IFormContacts), string>>;

export interface IOrderResult extends IFormAddress, IFormContacts, IOrder  {
  total: number;
}
