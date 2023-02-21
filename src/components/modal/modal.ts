import './modal.css';
import { Block } from '../../core';
import { withStore, WithStoreProps } from '../../hoc';

interface ModalProps extends WithStoreProps { }

class Modal extends Block<ModalProps> {
  public static override componentName = 'Modal';

  override render() {
    return `
     <section class="modal-layout">
      ${this.props.store.getState().dialogContent}
     </section>
   `;
  }
}

export default withStore(Modal);
