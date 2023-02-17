import './modal.css';
import { Block } from '../../core';
import { withStore, WithStoreProps } from '../../hoc';

interface ModalProps extends WithStoreProps { }

class Modal extends Block<ModalProps> {
  public static override componentName = 'Modal';

  override render() {
    return `
     <div class="modal-layout">
      ${this.props.store.getState().dialogContent}
     </div>
   `;
  }
}

export default withStore(Modal);
