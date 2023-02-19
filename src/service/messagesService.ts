import { WebSocketUrlData } from '../api/api-types';
import { getWebSocketUrl } from '../api/urls';
import { ChatsApi, WebSocketApi } from '../api';
import { AppState, Dispatch } from '../models/app';
import { apiHasError } from '../utils';
import {
  OpenConnectionData,
  WebSocketCloseCode,
  WebSocketCloseReason,
  WebSocketMessage,
  WebSocketMessageType,
} from '../api/websocket-types';

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

  public async openConnection(
    dispatch: Dispatch<AppState>,
    data: OpenConnectionData,
  ) {
    dispatch({ isLoading: true });
    try {
      const tokenResponse = await ChatsApi.getInstance().getChatToken(data.chatId);
      if (!apiHasError(tokenResponse)) {
        dispatch({ currentChatToken: tokenResponse.token });
        const { userId, chatId } = data;
        const urlData = {
          userId,
          chatId,
          token: tokenResponse.token,
        } as WebSocketUrlData;
        const url = getWebSocketUrl(urlData);
        WebSocketApi.getInstance().connect(url);
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
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
  ) {
    dispatch({ isLoading: true });
    try {
      dispatch({ currentChatMessages: [] });
      const sendMessageObject = {
        content: '0',
        type: WebSocketMessageType.GET_OLD,
      } as WebSocketMessage;
      WebSocketApi.getInstance().sendMessage(JSON.stringify(sendMessageObject));
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
