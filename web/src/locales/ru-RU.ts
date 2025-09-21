import menu from './ru-RU/menu';
import pages from './ru-RU/pages';

export default {
  'app.name': 'Chime Insight',
  'app.error.network': 'Сетевая ошибка',
  'app.error.default': 'Ошибка сервера, пожалуйста, попробуйте позже',
  'app.error.login.expired': 'Истек срок действия сеанса, пожалуйста, войдите снова',
  'app.tab.close.all': 'Закрыть все',
  'app.tab.close.current': 'Закрыть текущую',
  'app.tab.close.others': 'Закрыть другие',
  ...menu,
  ...pages,
};
