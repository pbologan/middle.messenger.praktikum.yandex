import { Block } from './Block';

export function renderDOM(block: Block<any>) {
  const root = document.querySelector('#root');
  root!.innerHTML = '';
  root!.appendChild(block.getContent());
}
