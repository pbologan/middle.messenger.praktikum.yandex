import { renderDOM } from '../../core';
import { Button } from './button';

describe('Button component', () => {
  it('should call onClick', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const mock = jest.fn();
    const button = new Button({
      className: '',
      text: 'Button',
      onClick: mock,
    });
    renderDOM(button);
    button.getElement()?.click();
    expect(mock).toBeCalled();
  });
});
