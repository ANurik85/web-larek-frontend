export interface ICard {
  id: string;
  description: string;
  title: string;
  category: string;
  price: number;
  image: string;
}
 
export interface IForm {
  address: string;
  phone: string;
  email: string;
  total: number;
  payment: string;
  valid: boolean;
  errors: string[];
}
export interface ICardsData {
  cards: ICard[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
  getCard(cardId: string): ICard;
  addBasketCard(BasketCard: TBasketCard): void;
  getBasketCard(): TBasketCard[];
  deleteBasketCard(cardId: string): void;
  checkFormValidation(data: Record<keyof TValidationInfo, string>): boolean;
  reserFormInput(data: Record<keyof TValidationInfo, string>): void;
  placeholderFormInput(data: Record<keyof TValidationInfo, string>): void;
  checkAddress(value: string): boolean;
  checkPhone(value: string) : boolean; 
  checkEmail(value: string): boolean;
}

export interface IOrder extends TValidationInfo {
  items: string[]
}
export interface TAddressForm {
  address: string;
  paymentMethod: 'card' | 'cash';
}
export interface IOrderResult {
  id: string;
}
export type TCardfull = Pick<ICard, 'title' | 'description' | 'category' | 'price'>;

export type TСontactsForm = Pick<IForm, 'email' | 'phone' | 'valid' | 'errors'>;
export type TOrderSuccess = Pick<IForm, 'total'>;

export type TBasketCard = Pick<ICard, 'title' | 'price'>;
export type TValidationInfo = Pick<IForm, 'email' | 'phone' | 'address'>;
export type FormErrors = Partial<Record<keyof IOrder, string>>;  
export type TBasketForm = Pick<IForm, 'total'> & Pick<ICard, 'title' | 'price'>;