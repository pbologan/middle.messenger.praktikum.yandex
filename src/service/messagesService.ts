import { WebSocketUrlData } from '../api/api-types';
import { getWebSocketUrl } from '../api/urls';
import { ChatsApi, WebSocketApi } from '../api';
import { AppState, Dispatch } from '../models/app';
import { apiHasError } from '../utils';
import {
  WebSocketCloseCode,
  WebSocketCloseReason,
  WebSocketMessage,
  WebSocketMessageType,
} from '../api/websocket-types';
import { Store } from '../core';

export class MessagesService {
  private static instance: MessagesService | null = null;

  private constructor() {
    if (MessagesService.instance) {
      throw new Error('Singleton. Use getInstance method');
    }
  }

  public static getInstance() {
    if (!MessagesService.instance) {
      MessagesService.instance = new MessagesService();
    }
    return MessagesService.instance;
  }

  public openConnection(
    dispatch: Dispatch<AppState>,
    data: WebSocketUrlData,
  ) {
    dispatch({ isLoading: true });
    const url = getWebSocketUrl(data);
    WebSocketApi.getInstance().connect(url);
    dispatch({ isLoading: false });
  }

  public closeConnection(dispatch: Dispatch<AppState>) {
    dispatch({ isLoading: true });
    WebSocketApi.getInstance().close({
      code: WebSocketCloseCode.NORMAL,
      reason: WebSocketCloseReason[WebSocketCloseCode.NORMAL],
    });
    dispatch({ isLoading: false });
  }

  public async getMessages(
    dispatch: Dispatch<AppState>,
    chatId: number,
  ) {
    dispatch({ isLoading: true });
    try {
      dispatch({ currentChatMessages: [] });
      const messagesCountResponse = await ChatsApi.getInstance().getChatNewMessagesCount(chatId);
      if (!apiHasError(messagesCountResponse)) {
        const count = messagesCountResponse.unread_count;
        let offset = 0;
        while (Store.getInstance().getState().currentChatMessages.length < count) {
          const sendMessageObject = {
            content: String(offset),
            type: WebSocketMessageType.GET_OLD,
          } as WebSocketMessage;
          WebSocketApi.getInstance().sendMessage(JSON.stringify(sendMessageObject));
          if (offset !== Store.getInstance().getState().currentChatMessages.length) {
            offset = Store.getInstance().getState().currentChatMessages.length;
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public sendTextMessage(
    dispatch: Dispatch<AppState>,
    message: string,
  ) {
    dispatch({ isLoading: false });
    const sendTextObject = {
      content: message,
      type: WebSocketMessageType.MESSAGE,
    } as WebSocketMessage;
    WebSocketApi.getInstance().sendMessage(JSON.stringify(sendTextObject));
  }

  public async sentFileMessage(
    dispatch: Dispatch<AppState>,
    file: File,
  ) {
    dispatch({ isLoading: true });
    try {
      const sendFileResponse = await ChatsApi.getInstance().sendFile(file);
      if (!apiHasError(sendFileResponse)) {
        const sendFileObject = {
          content: String(sendFileResponse.id),
          type: WebSocketMessageType.FILE,
        } as WebSocketMessage;
        WebSocketApi.getInstance().sendMessage(JSON.stringify(sendFileObject));
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }
}
