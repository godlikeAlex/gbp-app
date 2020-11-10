import io from 'socket.io-client';
import { ChatContact, Message } from '../redux/types';
const SOCKET_URL = 'http://192.168.0.102:8000';

export let socket: Socket;

export const authSocket = (token: string) => socket = new Socket(token);

export default class Socket {
  public socket: any;
  public token: string;

  constructor(token: string) {
    this.token = token;
    this.initSocket();
  };

  private initSocket() {
    this.socket = io(SOCKET_URL, {query: {jwt: this.token}});
  }

  public onMessage(cb: (data: Message) => void) {
    this.socket.on('newMessage', cb)
  }

  public onMessageReaded(cb: (data: {userId: number, chatId: number}) => void) {
    this.socket.on('messageReaded', cb)
  }

  public onNewUserConnected(cb: (data: {online: boolean, id: number}) => void) {
    this.socket.on('onlineUserUpdated', cb)
  }

  public onNewChatCreated(cb: (data: {chat: ChatContact, message: Message}) => void) {
    this.socket.on('newChatCreated', cb)
  }

  public imReadedMessages(userId: number, chatId: number) {
    this.socket.emit('messages readed', {userId, chatId});
  }

  public off(event: string, handler: any) {
    this.socket.off(event, handler);
  }
}