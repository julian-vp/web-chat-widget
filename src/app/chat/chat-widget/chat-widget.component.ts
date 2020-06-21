import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { fadeIn, fadeInOut } from '../animations';
import { ChatService } from '../chat.service';

const rand = max => Math.floor(Math.random() * max);
const generateGUID = () => {
  const a = function (): string {
    return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
  };
  return a() + '-' + a() + '-' + a();
};

@Component({
  selector: 'chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  animations: [fadeInOut, fadeIn],
})
export class ChatWidgetComponent implements OnInit {

  @ViewChild('bottom') bottom: ElementRef;

  @Input() public theme: 'blue' | 'grey' | 'red' = 'blue';
  @Input() public merchantId: string;
  @Input() public agentId?: string;
  @Input() public appEnv: string;
  @Input() public agentEnv: string;


  public _visible = false;
  public operator: { name: string; status: string; avatar: string; };
  public client: { userId: string; name: string; status: string; avatar: string; };

  public get visible() {
    return this._visible;
  }

  @Input() public set visible(visible) {
    this._visible = visible;
    if (this._visible) {
      setTimeout(() => {
        this.scrollToBottom();
        this.focusMessage();
      }, 0);
    }
  }

  public focus = new Subject();
  public messages = [];

  /**
   *
   */
  constructor(private _chatService: ChatService) {

    console.log('merchantId: ', this.merchantId);

    this.operator = {
      name: 'Operator',
      status: 'online',
      avatar: `https://randomuser.me/api/portraits/women/${rand(100)}.jpg`,
    };

    this.client = {
      userId: generateGUID(),
      name: 'Guest User',
      status: 'online',
      avatar: `https://firebasestorage.googleapis.com/v0/b/swifter-ai-app-dev.appspot.com/o/dist%2Fweb-chat%2Fuser.png?alt=media&token=9cae9339-7407-4ff0-9630-773eae8ca9a6`,
    };
  }


  ngOnInit() {

    setTimeout(() => {
      this._chatService.callAgent(this.client.userId, 'Hi', this.merchantId, this.agentId, this.appEnv, this.agentEnv)
        .then(response => {
          this.addMessage(this.operator, response, 'received');
        });
    }, 2000);

    setTimeout(() => {
      this.visible = true;
    }, 4000);
  }

  public addMessage(from, text, type: 'received' | 'sent') {
    this.messages.unshift({
      from,
      text,
      type,
      date: new Date().getTime(),
    });
    this.scrollToBottom();
  }

  public scrollToBottom() {
    if (this.bottom !== undefined) {
      setTimeout(() => {
        this.bottom.nativeElement.scrollIntoView();
      }, 500);
    }
  }

  public focusMessage() {
    this.focus.next(true);
  }

  public async getMessage(userId: string, message: string) {
    const response = await this._chatService.callAgent(userId, message, this.merchantId, this.agentId, this.appEnv, this.agentEnv);
    this.addMessage(this.operator, response, 'received');
  }

  public toggleChat() {
    this.visible = !this.visible;
  }

  public sendMessage({ message }) {
    if (message.trim() === '') {
      return;
    }
    this.addMessage(this.client, message, 'sent');
    this.getMessage(this.client.userId, message.trim());
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
      this.focusMessage();
    }
    if (event.key === '?' && !this._visible) {
      this.toggleChat();
    }
  }

}
