import { PongResponse, UserConnectedResponse, WebSocketMessageType } from '../api/websocket-types';

export function isPongResponse(response: any): response is PongResponse {
  return response && response.type === WebSocketMessageType.PONG;
}

export function isUserConnectedResponse(response: any): response is UserConnectedResponse {
  return response && response.type === WebSocketMessageType.USER_CONNECTED;
}
