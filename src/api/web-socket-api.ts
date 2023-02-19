import {
  Message,
  WebSocketCloseCode,
  WebSocketCloseType,
  WebSocketEvent,
  WebSocketMessage,
  WebSocketMessageType,
} from './websocket-types';
import { Store } from '../core';

export class WebSocketApi {
  private static instance: WebSocketApi | null = null;

  private webSocket: WebSocket | null = null;

  private constructor() {
    if (WebSocketApi.instance) {
      throw new Error('Singleton. Use getInstance method');
    }
  }

  public static getInstance() {
    if (!WebSocketApi.instance) {
      WebSocketApi.instance = new WebSocketApi();
    }
    return WebSocketApi.instance;
  }

  public connect(url: string) {
    if (this.webSocket) {
      this.webSocket = null;
    }
    this.webSocket = new WebSocket(url);
    this.addEventListeners();
  }

  public close(closeType: WebSocketCloseType) {
    if (this.webSocket) {
      this.removeEventListeners();
      this.webSocket.close(closeType.code, closeType.reason);
      this.webSocket = null;
    }
  }

  public sendMessage(message: string | Blob) {
    if (this.webSocket) {
      this.webSocket.send(message);
    }
  }

  private addEventListeners() {
    this.webSocket?.addEventListener(WebSocketEvent.OPEN, this.onOpen.bind(this));
    this.webSocket?.addEventListener(WebSocketEvent.CLOSE, this.onClose.bind(this));
    this.webSocket?.addEventListener(WebSocketEvent.ERROR, this.onError.bind(this));
    this.webSocket?.addEventListener(WebSocketEvent.MESSAGE, this.onMessage.bind(this));
  }

  private removeEventListeners() {
    this.webSocket?.removeEventListener(WebSocketEvent.OPEN, this.onOpen.bind(this));
    this.webSocket?.removeEventListener(WebSocketEvent.CLOSE, this.onClose.bind(this));
    this.webSocket?.removeEventListener(WebSocketEvent.ERROR, this.onError.bind(this));
    this.webSocket?.removeEventListener(WebSocketEvent.MESSAGE, this.onMessage.bind(this));
  }

  private onMessage(event: MessageEvent<Message | Array<Message>>) {
    const store = Store.getInstance();
    let messages = [...store.getState().currentChatMessages];
    const { data } = event;
    if (Array.isArray(data)) {
      const currentMessagesSet = new Set(messages);
      const difference = new Set(data);
      currentMessagesSet.forEach((el) => {
        difference.delete(el);
      });
      messages = [...messages, ...difference];
    } else {
      const found = messages.find((message) => message.content === data.content);
      if (!found) {
        messages.push(data);
      }
    }
    store.dispatch({ currentChatMessages: messages });
  }

  private onOpen() {
    const onOpenMessage = {
      content: String(Store.getInstance().getState().user?.id),
      type: WebSocketMessageType.USER_CONNECTED,
    } as WebSocketMessage;
    this.sendMessage(JSON.stringify(onOpenMessage));
  }

  private onClose(event: CloseEvent) {
    if (!event.wasClean || event.code !== WebSocketCloseCode.NORMAL) {
      console.log(event.reason);
    }
  }

  private onError(event: Event) {
    console.log('WebSocket error', event);
  }
}
