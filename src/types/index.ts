
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
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
  cardId: string;
  getCardItem(id: string): ICard | undefined;
  setCatalog(items: ICard[]): void;
  setPreview(item: ICard[]): void;
  addToBasket(cardId: IProduct): void;
}

// export type IBasketItem = Pick<ICard, 'id' | 'title' | 'price'> & {
//   isMyBid: boolean
// };

// export interface IOrder {
//     items: ICard[];
//     total: number;
//   }

export interface IFormContacts {
  email: string;
  phone: string;
}

export interface IFormAddress {
  address: string;
  paymentMethod: string;

}

export interface IOrder extends IFormContacts, IFormAddress {
  items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {

  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]
}

// -----------------------

// export type TCardfull = Pick<ICard, 'title' | 'description' | 'category' | 'price'>;

// // export type TСontactsForm = Pick<IForm, 'email' | 'phone' | 'valid' | 'errors'>;
// // export type TOrderSuccess = Pick<IForm, 'total'> & Pick<ICard, 'id'>;
// export type TBasketCard = Pick<ICard, 'title' | 'price'> & Pick<ICard, 'id'>;
// export type TValidationInfo = Pick<IForm, 'email' | 'phone' | 'address'>;
// export type FormErrors = Partial<Record<keyof IOrder, string>>;
// // export type TBasketForm = Pick<IForm, 'total'> & Pick<ICard, 'title' | 'price'>;