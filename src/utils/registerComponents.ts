import registerComponent from '../core/registerComponent';
import Button from '../components/button';
import Input from '../components/input';
import Error from '../components/error';
import ControlledInput from '../components/controlled-input';
import ChatsList from '../pages/chat/chats-list';
import ChatsListHeader from '../pages/chat/chats-list/header';
import ChatItem from '../pages/chat/chats-list/chat-item/chat-item';
import MessagesList from '../pages/chat/messages-list';
import MessagesHeader from '../pages/chat/messages-list/header';
import MessageInput from '../pages/chat/messages-list/message-input';
import ErrorPage from '../pages/errors';
import { Loader } from '../components/loader';

export function registerComponents() {
  registerComponent(Button);
  registerComponent(Input);
  registerComponent(Error);
  registerComponent(ControlledInput);
  registerComponent(ChatsList);
  registerComponent(ChatsListHeader);
  registerComponent(ChatItem);
  registerComponent(MessagesList);
  registerComponent(MessagesHeader);
  registerComponent(MessageInput);
  registerComponent(ErrorPage);
  registerComponent(Loader);
}
