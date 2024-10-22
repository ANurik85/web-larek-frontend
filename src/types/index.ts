
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: string;
}
export interface IProduct {
  id: string;
  title: string;
  price: string;
  indexNumber: number;
   
}

export interface ICardsData {
  catalog: ICard[];
  preview: string | null;
  loading: boolean;
  cardId: string;
  getCardItem(id: string): ICard | undefined;
  setCatalog(items: ICard[]): void;
  setPreview(item: ICard[]): void;
}


export interface IFormContacts {
  email: string;
  phone: string;
}

export interface IFormAddress {
  address: string;
  payment: string;

}

export interface IOrder {
  items: string[]
}

export type FormErrors = Partial<Record<keyof (IFormAddress & IFormContacts), string>>;

export interface IOrderResult extends IFormAddress, IFormContacts, IOrder  {
  total: number;
}
