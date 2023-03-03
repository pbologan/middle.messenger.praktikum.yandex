import { Input } from './input';
import { renderDOM } from '../../core';

describe('Input component', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should call onFocus', () => {
    const onFocusMock = jest.fn();
    const input = new Input({
      onFocus: onFocusMock,
    });
    renderDOM(input);
    input.getElement()?.focus();
    expect(onFocusMock).toHaveBeenCalled();
  });

  it('should call onBlur', () => {
    const onBlurMock = jest.fn();
    const input = new Input({
      onBlur: onBlurMock,
    });
    renderDOM(input);
    input.getElement()?.focus();
    input.getElement()?.blur();
    expect(onBlurMock).toHaveBeenCalled();
  });

  it('should contain value', () => {
    const value = 'test value';
    const input = new Input({
      value,
    });
    expect((input.getElement() as HTMLInputElement).value).toEqual(value);
  });
});
