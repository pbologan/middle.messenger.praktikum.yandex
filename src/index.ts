import './styles.css';
import ErrorPage from './pages/errors';
import ChatPage from './pages/chat';
import SignupPage from './pages/sign-up';
import LoginPage from './pages/login';
import ProfilePage from './pages/profile';
import PageChanger from './core/PageChanger';
import { Link } from './utils/routing/routing';
import { registerComponents } from './utils/registerComponents';

registerComponents();

document.addEventListener('DOMContentLoaded', () => {
  const loginPage = new LoginPage({});
  const signupPage = new SignupPage({});
  const chatPage = new ChatPage({});
  const profilePage = new ProfilePage({});
  const error404Page = new ErrorPage({ code: '404', description: 'Страница не существует' });
  const error500Page = new ErrorPage({ code: '500', description: 'Что-то пошло не так, уже разбираемся...' });

  const pageChanger = new PageChanger(Link.LOGIN, loginPage);

  pageChanger.addPage(Link.SIGN_UP, signupPage);
  pageChanger.addPage(Link.CHAT, chatPage);
  pageChanger.addPage(Link.PROFILE, profilePage);
  pageChanger.addPage(Link.ERROR_404, error404Page);
  pageChanger.addPage(Link.ERROR_500, error500Page);

  window.addEventListener('popstate', () => {
    const link = window.location.pathname;
    const foundLink = Object.values(Link).find((item: string) => item === link);
    if (foundLink) {
      pageChanger.onLinkChanged(foundLink);
    }
  });
});
