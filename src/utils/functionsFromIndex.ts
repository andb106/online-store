import { IFilters, IProduct, IState, SearchKeys } from '../types';

export function filterData(data: IProduct[], state: IState) {
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
}

export function minMaxValuesFromData(data: IProduct[], prop: SearchKeys.price | SearchKeys.stock) {
  const arr = data.map((item) => item[prop]);
  const res = [Math.min(...arr), Math.max(...arr)];
  return res;
}

export function countItemsForSpan(
  currentData: IProduct[],
  allData: IProduct[],
  filterDataList: string[],
  productProp: SearchKeys.category | SearchKeys.brand
) {
  const res: number[][] = [];
  filterDataList.forEach((prop) => {
    const countItemsCurrent = currentData.filter((product) => product[productProp] === prop).length;
    const countItemsAll = allData.filter((product) => product[productProp] === prop).length;
    res.push([countItemsCurrent, countItemsAll]);
  });
  return res;
}

export function sortProduct(products: IProduct[], sortParam: number) {
  switch (sortParam) {
    case 1:
      return products.sort((a, b) => a.price - b.price);
    case 2:
      return products.sort((a, b) => b.price - a.price);
    case 3:
      return products.sort((a, b) => a.rating - b.rating);
    case 4:
      return products.sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}

export function searchProducts(data: IProduct[], searchValue: string) {
  const res = data.filter((product) => {
    const strFromProps = Object.values(product).slice(1, -2).join(' ').toLowerCase();
    if (strFromProps.includes(searchValue)) {
      return true;
    } else {
      return false;
    }
  });
  return res;
}

export function changeUrl(filterName: string, state: IState) {
  const urlParams = new URLSearchParams(location.search);

  if (isObjKey<IFilters>(filterName, state.filters)) {
    state.filters[filterName].length
      ? urlParams.set(filterName, state.filters[filterName].join(','))
      : urlParams.delete(filterName);
  }

  if (isObjKey<IState>(filterName, state)) {
    state[filterName] ? urlParams.set(filterName, `${state[filterName]}`) : urlParams.delete(filterName);
  }

  history.pushState(
    null,
    '',
    urlParams.toString().length ? location.pathname + `?${urlParams.toString()}` : location.pathname
  );
}

function isObjKey<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}
