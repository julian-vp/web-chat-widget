import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

export interface IChat {
  id: string;
  agentEnvironment: string;
  dialog: any[];
}

export interface IChatMessage {
  who: string;
  message: string;
  time: string;
  type: 'normal' | 'error' | 'warning';
  debugInfo: string;
}

@Injectable()
export class ChatService {

  contacts: any[];
  chats: any[];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer
  ) {
    // Set the defaults
    this.chats = [];

  }

  /**
     * Call Agent
     *
     * @returns {Promise<any>}
     */
  async callAgent(userId: string, userMessage: string, merchantId?: string,
    agentId?: string, appEnv?: string, agentEnv?: string): Promise<string> {
    try {
      const data: any = await this._httpClient.get(`${environment.apiUrl}`,
        {
          params: {
            'merchantId': merchantId && merchantId,
            'agentId': agentId && agentId,
            'userId': userId,
            'textMessage': userMessage,
            'appEnv': appEnv || 'prod',
            'agentEnv': agentEnv || 'prod'
          }
        }).toPromise();

      // Message
      const newMessage = data?.queryResult?.fulfillmentText || '<em>no response</em>';

      return newMessage;
    } catch (error) {

      let errorText = error.statusText;
      const details = error?.error?.details || error?.details;

      if (details) {
        errorText = details.split(':')[1]?.trim() || details;
      }
      const newMessage = 'Sorry, there was a glitch in the system. Please try again later.';

      return newMessage;
    }
  }
}
