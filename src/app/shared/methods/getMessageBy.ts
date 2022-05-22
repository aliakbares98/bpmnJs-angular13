import { GeneralMessage } from '@interfaces/global.interfaces';

export function getMessageBy(codeMessage: number) {
  const localMessages = localStorage.getItem('hermes_generalMessage');
  if (localMessages) {
    const messages = JSON.parse(localMessages);
    const message = messages.find(
      (el: GeneralMessage) => el.CodeMessage === codeMessage
    );

    return message?.MessageText;
  }
}
