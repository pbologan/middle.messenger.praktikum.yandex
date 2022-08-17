enum Link {
  LOGIN = '/',
  SIGN_UP = '/signup',
  CHAT = '/chat',
  PROFILE = '/profile',
  ERROR_404 = '/404',
  ERROR_500 = '/500',
}

const pushPage = (link: Link) => {
  window.history.pushState({}, '', link);
  window.dispatchEvent(new Event('popstate'));
};

export { Link, pushPage };
