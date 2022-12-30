import { Product } from './components/product/product';
import './styles-global.scss';
// import { IProduct } from './types';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { dataCategory, dataBrand } from './data/dataFilters';
import { Filters } from './components/filters/filters';
// import { Observer } from './utils/observer';
import { IProduct, IState } from './types';

const state: IState = {
  filters: {
    category: [],
    brand: [],
    price: {
      min: 0,
      max: 1749,
    },
    stock: {
      min: 2,
      max: 150,
    },
  },
};

const data = dataJson;
console.log(data);

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
    return product.price >= state.filters.price.min && product.price <= state.filters.price.max;
  });

  res = res.filter((product) => {
    return product.stock >= state.filters.stock.min && product.stock <= state.filters.stock.max;
  });

  return res;
};

const productList = new ProductList(data.products);
const filters = new Filters(
  dataCategory,
  dataBrand,
  (values) => {
    state.filters.price.min = +values[0];
    state.filters.price.max = +values[1];
    console.log(`change state from dual slider (price) -->`, state);

    const resFilteredData = filterData(data.products, state);
    productList.updateItems(resFilteredData);
  },
  (values) => {
    state.filters.stock.min = +values[0];
    state.filters.stock.max = +values[1];
    console.log(`change state from dual slider (stock) -->`, state);

    const resFilteredData = filterData(data.products, state);
    productList.updateItems(resFilteredData);
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
