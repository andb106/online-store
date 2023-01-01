import { Product } from './components/product/product';
import './styles-global.scss';
// import { IProduct } from './types';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { Filters } from './components/filters/filters';
// import { Observer } from './utils/observer';
import { IProduct, IState } from './types';

const state: IState = {
  filters: {
    category: [],
    brand: [],
    price: [0, 0],
    stock: [0, 0],
  },
};

const data = dataJson;
const categoryList = new Set(data.products.map((product) => product.category));
const brandList = new Set(data.products.map((product) => product.brand));

const minMaxPriceInitial = minMaxValuesFromData(data.products, 'price');
const minMaxStockInitial = minMaxValuesFromData(data.products, 'stock');

const countItemsCategoryInitial = countItemsForSpan(data.products, data.products, [...categoryList], 'category');
const countItemsBrandInitial = countItemsForSpan(data.products, data.products, [...brandList], 'brand');

state.filters.price = minMaxPriceInitial;
state.filters.stock = minMaxStockInitial;

const mainElem: HTMLElement | null = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

const filterData = (data: IProduct[], state: IState) => {
  let res = data;

  if (state.filters.category.length) {
    res = res.filter((product) => {
      return state.filters.category.indexOf(product.category) > -1;
    });
  }

  if (state.filters.brand.length) {
    res = res.filter((product) => {
      return state.filters.brand.indexOf(product.brand) > -1;
    });
  }

  res = res.filter((product) => {
    return product.price >= state.filters.price[0] && product.price <= state.filters.price[1];
  });

  res = res.filter((product) => {
    return product.stock >= state.filters.stock[0] && product.stock <= state.filters.stock[1];
  });

  return res;
};

const productList = new ProductList(data.products);
const filters = new Filters(
  [...categoryList],
  countItemsCategoryInitial,
  [...brandList],
  countItemsBrandInitial,
  minMaxPriceInitial,
  minMaxStockInitial,
  (values) => {
    state.filters.price = [+values[0], +values[1]];
    console.log(`change state from dual slider (price) -->`, state);

    const resFilteredData = filterData(data.products, state);
    productList.updateItems(resFilteredData);

    updateFiltersValues(resFilteredData, data.products, true, false);
  },
  (values) => {
    state.filters.stock = [+values[0], +values[1]];
    console.log(`change state from dual slider (stock) -->`, state);

    const resFilteredData = filterData(data.products, state);
    productList.updateItems(resFilteredData);

    updateFiltersValues(resFilteredData, data.products, false, true);
  }
);

// const testObserver = new Observer<IProduct[]>();
// testObserver.subscribe(productList.updateItems.bind(productList));

filters.element.addEventListener('click', (e) => {
  if (e.target instanceof HTMLInputElement) {
    const filterType = e.target.closest('.filter-list')?.previousSibling?.textContent?.toLocaleLowerCase();

    if (filterType === 'category' || filterType === 'brand') {
      const ind = state.filters[filterType].indexOf(e.target.id);
      e.target.checked && ind === -1
        ? state.filters[filterType].push(e.target.id)
        : state.filters[filterType].splice(ind, 1);
    }

    const resFilteredData = filterData(data.products, state);

    console.log(`change state from ${filterType}-->`, state);

    // testObserver.broadcast(resFilteredData);
    productList.updateItems(resFilteredData);

    updateFiltersValues(resFilteredData, data.products, false, false);
  }
});

// productList.element.addEventListener('click', () => {
//   testObserver.broadcast('test broadcast from click on product list');
// });

new Router([
  {
    path: 'page 404',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = '404 page';
    },
  },
  {
    path: '/',
    view: () => {
      mainElem.replaceChildren();
      mainElem.append(filters.element);
      mainElem.append(productList.element);
    },
  },
  {
    path: '/cart',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = 'cart page';
    },
  },
  {
    path: '/product/:id', // id - product id, but in data-array get position (id - 1) !
    view: (params) => {
      const len = data.products.length;
      mainElem.innerHTML = '';
      if (+params.id - 1 >= 0 && +params.id - 1 < len) {
        mainElem.append(new Product(data.products[+params.id - 1]).element);
      } else {
        mainElem.innerHTML = `Product with id ${params.id} not found`;
      }
    },
  },
]);

function minMaxValuesFromData(data: IProduct[], prop: keyof Pick<IProduct, 'price' | 'stock'>) {
  const arr = data.map((item) => item[prop]);
  const res = [Math.min(...arr), Math.max(...arr)];
  return res;
}

function countItemsForSpan(
  currentData: IProduct[],
  allData: IProduct[],
  filterDataList: string[],
  productProp: keyof Pick<IProduct, 'category' | 'brand'>
) {
  const res: number[][] = [];
  filterDataList.forEach((prop) => {
    const countItemsCurrent = currentData.filter((product) => product[productProp] === prop).length;
    const countItemsAll = allData.filter((product) => product[productProp] === prop).length;
    res.push([countItemsCurrent, countItemsAll]);
  });
  return res;
}

function updateFiltersValues(
  currentProducts: IProduct[],
  allProducts: IProduct[],
  isCallingInPrice = false,
  isCallingInStock = false
) {
  const countItemsCategory = countItemsForSpan(currentProducts, allProducts, [...categoryList], 'category');
  const countItemsBrand = countItemsForSpan(currentProducts, allProducts, [...brandList], 'brand');

  const minMaxPrice = minMaxValuesFromData(currentProducts, 'price');
  const minMaxStock = minMaxValuesFromData(currentProducts, 'stock');

  filters.checkBoxFilters[0].updateList(countItemsCategory);
  filters.checkBoxFilters[1].updateList(countItemsBrand);

  if (!isCallingInPrice && !isCallingInStock) {
    filters.sliderFilters[0].slider?.set(minMaxPrice);
    filters.sliderFilters[1].slider?.set(minMaxStock);
  }

  if (isCallingInPrice) {
    filters.sliderFilters[1].slider?.set(minMaxStock);
  }

  if (isCallingInStock) {
    filters.sliderFilters[0].slider?.set(minMaxPrice);
  }
}
