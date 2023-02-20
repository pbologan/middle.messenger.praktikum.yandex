import { PongResponse, WebSocketMessageType } from '../api/websocket-types';

export function isPongResponse(response: any): response is PongResponse {
  return response && response.type === WebSocketMessageType.PONG;
}
