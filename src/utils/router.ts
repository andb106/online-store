import { IRoute } from '../types';

type Params = { route: IRoute; result: RegExpMatchArray | null };

export default class Router {
  routeList: IRoute[];
  constructor(routes: IRoute[]) {
    this.routeList = routes;
    this.init();
  }

  navigateTo = (url: string | null) => {
    history.pushState(null, '', url);
    this.router();
  };

  init = () => {
    window.addEventListener('popstate', this.router);
    document.body.addEventListener('click', (e) => {
      const navLink = e.target as HTMLElement;
      if (navLink && navLink.matches('[router-link]')) {
        e.preventDefault();
        this.navigateTo(navLink.getAttribute('href'));
      }
    });
    this.router();
  };

  router = () => {
    const potentialMatches = this.routeList.map((route) => ({
      route: route,
      result: location.pathname.match(this.pathToRegex(route.path)),
    }));

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

    if (!match) {
      match = {
        route: this.routeList[0],
        result: [location.pathname],
      };
    }

    const params = this.getParams(match);
    params.urlSearch = location.search;

    match.route.view(params);
  };

  pathToRegex = (path: string) => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

  getParams = (match: Params) => {
    if (match.result) {
      const values = match.result.slice(1);
      const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);
      return Object.fromEntries(
        keys.map((key, i) => {
          return [key, values[i]];
        })
      );
    } else return {};
  };
}
