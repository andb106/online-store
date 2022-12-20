import { IRoute } from '../types';

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
      isMatch: location.pathname === route.path,
    }));

    let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

    if (!match) {
      match = {
        route: this.routeList[0],
        isMatch: true,
      };
    }

    match.route.view();
  };
}
