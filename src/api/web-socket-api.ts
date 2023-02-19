import {
  Message,
  transformMessageDTO,
  WebSocketCloseCode, WebSocketCloseReason,
  WebSocketCloseType,
  WebSocketEvent,
} from './websocket-types';
import { Store } from '../core';
import { MessagesService } from '../service/messagesService';

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
      this.close({
        code: WebSocketCloseCode.NORMAL,
        reason: WebSocketCloseReason[WebSocketCloseCode.NORMAL],
      });
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
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
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

  private onMessage(event: MessageEvent) {
    const store = Store.getInstance();
    let messages = [...store.getState().currentChatMessages];
    const { data } = event;
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      const currentMessagesSet = new Set(messages);
      const receivedMessages: Array<Message> = parsedData.map((messageDTO) => {
        return transformMessageDTO(messageDTO);
      });
      const difference = new Set(receivedMessages);
      currentMessagesSet.forEach((el) => {
        difference.delete(el);
      });
      messages = [...messages, ...difference];
    } else {
      const found = messages.find((message) => message.content === parsedData.content);
      if (!found) {
        const transformed = transformMessageDTO(parsedData);
        messages.push(transformed);
      }
    }
    store.dispatch({ currentChatMessages: messages });
  }

  private onOpen() {
    Store.getInstance().dispatch(MessagesService.getInstance().getMessages);
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
