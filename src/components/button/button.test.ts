import { renderDOM } from '../../core';
import { Button } from './button';

describe('Button component', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should call onClick', () => {
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
