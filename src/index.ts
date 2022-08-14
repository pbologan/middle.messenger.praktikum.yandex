import './styles.css';
import { renderDOM } from './core';
import LoginPage from './pages/login';
import Button from './components/button';
import Input from './components/input';
import Error from './components/error';
import ControlledInput from './components/controlled-input';
import registerComponent from './core/registerComponent';

registerComponent(Button);
registerComponent(Input);
registerComponent(Error);
registerComponent(ControlledInput);

document.addEventListener('DOMContentLoaded', () => {
  const App = new LoginPage({});
  renderDOM(App);
});
