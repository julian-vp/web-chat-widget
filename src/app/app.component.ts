import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <chat-config [(theme)]="theme"></chat-config>
    <chat-widget [theme]="theme"
    [merchantId]="merchantId"
    [appEnv]="appEnv" [agentEnv]="agentEnv"
    [agentAvatar]="agentAvatar"></chat-widget>
  `,
})
export class AppComponent {
  public theme = 'blue';
  public merchantId = 'pH5vsgNnJQzP820kfDia';
  public agentId = undefined;
  public appEnv = 'dev';
  public agentEnv = 'draft';
  public agentAvatar = 'https://firebasestorage.googleapis.com/v0/b/swifter-ai-app-prod.appspot.com/o/dist%2Fweb-chat%2Fswifter-logo.png?alt=media&token=a23fc2f7-28b9-441c-b30a-dd774c936abc';
}
