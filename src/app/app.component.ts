import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <chat-config [(theme)]="theme"></chat-config>
    <chat-widget [theme]="theme" [operator]="operator" [messages]="messages"></chat-widget>
  `,
})
export class AppComponent {
  public theme = 'blue'
  public operator = {
    name: 'Operator',
    status: 'online',
    avatar: `https://randomuser.me/api/portraits/women/12.jpg`,
  }
  public messages = []
}
