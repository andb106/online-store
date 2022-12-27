import { Product } from './components/product/product';
import './styles-global.scss';
// import { IProduct } from './types';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { dataCategory, dataBrand } from './data/dataFilters';
import { Filters } from './components/filters/filters';
import { Observer } from './utils/observer';
import { IProduct, IState } from './types';

const state: IState = {
  filters: {
    category: [],
    brand: [],
  },
};

const data = dataJson;
console.log(data);

const mainElem: HTMLElement | null = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

const productList = new ProductList(data.products);
const filters = new Filters(dataCategory, dataBrand);

const testObserver = new Observer<IProduct[]>();
testObserver.subscribe(productList.updateItems.bind(productList));

filters.element.addEventListener('click', (e) => {
  if (e.target instanceof HTMLInputElement) {
    const filterType = e.target.closest('.filter-list')?.previousSibling?.textContent?.toLocaleLowerCase();
    console.log('filterType', filterType);

    if (filterType === 'category' || filterType === 'brand') {
      const ind = state.filters[filterType].indexOf(e.target.id);
      e.target.checked && ind === -1
        ? state.filters[filterType].push(e.target.id)
        : state.filters[filterType].splice(ind, 1);
    }

    let filteredData = data.products;

    if (state.filters.category.length) {
      filteredData = filteredData.filter((product) => {
        return state.filters.category.indexOf(product.category) > -1;
      });
    }

    if (state.filters.brand.length) {
      filteredData = filteredData.filter((product) => {
        return state.filters.brand.indexOf(product.brand) > -1;
      });
    }

    console.log('state-->', state);

    testObserver.broadcast(filteredData);
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
