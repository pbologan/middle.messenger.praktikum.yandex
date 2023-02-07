import { EventBus } from '../EventBus';
import { AppState } from './types';
import { Page } from '../router';

export const initialState: AppState = {
  user: null,
  page: Page.LOGIN,
  isLoading: false,
  loginFormError: null,
};

export type Dispatch<State> = (
  nextStateOrAction: Partial<State> | Action<State>,
  payload?: any,
) => void;

export type Action<State> = (
  dispatch: Dispatch<State>,
  state: State,
  payload: any,
) => void;

export class Store<State extends Record<string, any>> extends EventBus {
  private state: State = {} as State;

  constructor(state: State) {
    super();
    this.state = state;
    this.setState(state);
  }

  public getState() {
    return this.state;
  }

  public setState(nextState: Partial<State>) {
    const prevState = { ...this.state };
    this.state = { ...prevState, ...nextState };
    this.emit('changed', prevState, nextState);
  }

  public dispatch(nextStateOrAction: Partial<State> | Action<State>, payload?: any) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), this.state, payload);
    } else {
      this.setState({ ...this.state, ...nextStateOrAction });
    }
  }
}
