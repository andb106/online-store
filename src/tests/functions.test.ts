import {
  filterData,
  minMaxValuesFromData,
  countItemsForSpan,
  searchProducts,
  sortProduct,
} from '../utils/functionsFromIndex';
import * as dataJson from '../data/data.json';
import { IState, SearchKeys } from '../types';

const initialState: IState = {
  filters: {
    category: [],
    brand: [],
    price: [0, 10000],
    stock: [0, 10000],
  },
  sortParam: 0,
  searchValue: '',
  products: [],
  viewMode: 'tile',
};

describe('filterData function', () => {
  test('should work correctly without filters', () => {
    const state = {
      ...initialState,
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(100);
  });

  test('should work correctly price filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        price: [100, 500],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(7);
  });

  test('should work correctly stock filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        stock: [100, 500],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(34);
  });

  test('should work correctly various filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        category: ['smartphones'],
        brand: ['Apple', 'OPPO'],
        price: [100, 900],
        stock: [20, 130],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(3);
  });
});

describe('minMaxValuesFromData function', () => {
  test('should work correctly for price', () => {
    const result = minMaxValuesFromData(dataJson.products, SearchKeys.price);
    expect(result).toEqual([10, 1749]);
  });

  test('should work correctly for stock', () => {
    const result = minMaxValuesFromData(dataJson.products, SearchKeys.stock);
    expect(result).toEqual([2, 150]);
  });
});

describe('countItemsForSpan function', () => {
  test('should work correctly for initial data', () => {
    const categoryList = new Set(dataJson.products.map((product) => product.category));
    const result = countItemsForSpan(dataJson.products, dataJson.products, [...categoryList], SearchKeys.category);
    const expectRes = [
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
    ];
    expect(result).toEqual(expectRes);
  });

  test('should work correctly for filtered data', () => {
    const categoryList = new Set(dataJson.products.map((product) => product.category));
    const result = countItemsForSpan(
      dataJson.products.filter((product) => product.price > 100),
      dataJson.products,
      [...categoryList],
      SearchKeys.category
    );
    const expectRes = [
      [5, 5],
      [5, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [1, 5],
      [1, 5],
      [1, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [5, 5],
      [0, 5],
    ];
    expect(result).toEqual(expectRes);
  });
});

describe('searchProducts function', () => {
  test('should work correctly for empty string', () => {
    const result = searchProducts(dataJson.products, '');
    expect(result.length).toBe(100);
  });

  test('should work correctly for search string', () => {
    const result = searchProducts(dataJson.products, 'ab');
    expect(result.length).toBe(21);
  });
});

describe('sortProduct function', () => {
  test('should work correctly for right SortParam', () => {
    const expectRes = dataJson.products.sort((a, b) => a.price - b.price);
    const result = sortProduct(dataJson.products, 1);
    expect(result).toEqual(expectRes);
  });

  test('should work correctly for wrong sortParam', () => {
    const result = sortProduct(dataJson.products, 111);
    expect(result).toEqual(dataJson.products);
  });
});
