interface IError {
  status: number;
  code: number;
  name: string;
  message: string;
  data: any;
  alertMessage: string;
  url: string;
  method: string;
  stack: any;
}

export class Error {
  public status: number;

  public code: number;

  public name: string;

  public message: string;

  public data: any;

  public alertMessage: string = '';

  public url: string;

  public method: string;

  public stack: any;

  constructor(error: IError) {
    this.status = error.status;
    this.code = error.code;
    this.name = error.name;
    this.message = error.message;
    this.data = error.data;
    this.alertMessage = error.alertMessage;
    this.url = error.url;
    this.method = error.method;
    this.stack = error.stack;
  }

  public getOutPutData = () => {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
      alertMessage: this.alertMessage,
    };
  };
}
