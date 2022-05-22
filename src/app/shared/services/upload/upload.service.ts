import { Injectable } from '@angular/core';
import { SignalrService } from '@core/services/signalr.service';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private deleteContract = {
    ...this.signalr.baseContract,
    ApiKey: 'DeleteFile',
    ActionType: 'Delete',
    FormTag: 'DeleteFile',
  };

  private loadContract = {
    ...this.signalr.baseContract,
    ApiKey: 'DownloadFile',
    ActionType: 'LoadN',
    FormTag: 'DeleteFile',
  };

  constructor(public signalr: SignalrService) {}

  uploadFile(obj: any) {
    this.signalr.setEndPoint('upload');
    const formData: FormData = new FormData();
    formData.append('files', obj.file);
    return this.signalr.upload(formData)?.pipe(this.signalr.toHttpResponse());
  }

  loadFile(id: string) {
    const contract = {
      ...this.loadContract,
      Data: [{ Id: id, Model: 'Load', Criteria: null }],
    };

    return this.signalr.postHttp(contract);
  }
  downloadFile(id: string) {
    const contract = {
      ...this.loadContract,
      ConnectionId: this.signalr.connection.connectionId,
      RequestId: uuid.v4(),
      Data: [{ Id: id, Model: 'Load', Criteria: null }],
    };

    return this.signalr.download(contract);
  }
  removeFile(id: string) {
    const contract = {
      ...this.deleteContract,
      Data: [{ Id: id, Model: 'Delete', Criteria: null }],
    };

    return this.signalr.postHttp(contract);
  }
}
