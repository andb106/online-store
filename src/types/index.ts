export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IRoute {
  path: string;
  view: (params: { [k: string]: string }) => void;
}

export interface IState {
  filters: Filters;
}

export interface Filters {
  category: string[];
  brand: string[];
}
