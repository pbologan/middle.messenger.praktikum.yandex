import { isFormData } from './isFormData';

enum Method {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export enum ContentType {
  FORM_DATA = 'multipart/form-data',
}

type Data = Record<string, any> | FormData;

interface Options {
  data?: Data;
  method?: Method,
  headers?: Record<string, string>,
  retries?: number,
  timeout?: number;
}

function queryStringify(data?: Record<string, any>) {
  if (!data || Object.keys(data).length === 0) {
    return '';
  }

  return `?${Object.keys(data)
    .map((key: string) => `${key}=${data[key]}`)
    .join('&')}`;
}

class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<R extends unknown = any>(url: string, options: Options = {}): Promise<R> {
    const { data } = options;
    const queryString = isFormData(data) ? '' : queryStringify(data);
    return this.request<R>(
      url + queryString,
      { ...options, method: Method.GET },
      options.timeout,
    );
  }

  put<R extends unknown = any>(url: string, options: Options): Promise<R> {
    return this.request<R>(url, { ...options, method: Method.PUT }, options.timeout);
  }

  post<R extends unknown = any>(url: string, options: Options = {}): Promise<R> {
    return this.request<R>(url, { ...options, method: Method.POST }, options.timeout);
  }

  delete<R extends unknown = any>(url: string, options: Options): Promise<R> {
    return this.request<R>(url, { ...options, method: Method.DELETE }, options.timeout);
  }

  private sendData(
    xhr: XMLHttpRequest,
    method: Method,
    data?: Data,
  ) {
    if (!data || method === Method.GET) {
      xhr.send();
    } else if (isFormData(data)) {
      xhr.send(data);
    } else {
      xhr.send(JSON.stringify(data));
    }
  }

  private request<R>(url: string, options: Options, timeout = 5000): Promise<R> {
    const fullUrl = this.baseUrl + url;

    return new Promise((resolve, reject) => {
      const {
        headers, retries = 0, method, data,
      } = options;

      let retriesCount = retries;

      if (!method) {
        reject('No method provided');
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, fullUrl);
      xhr.timeout = timeout;

      if (headers) {
        Object.keys(headers).forEach((key: string) => {
          const header = headers[key];
          if (header) {
            xhr.setRequestHeader(key, header);
          }
        });
      }

      xhr.onload = () => {
        const result: R = JSON.parse(xhr.responseText);
        if (result) {
          resolve(result);
        } else {
          reject('Wrong type provided');
        }
      };
      xhr.onerror = (event) => {
        if (retriesCount > 0) {
          setTimeout(() => {
            xhr.open(method, fullUrl);
            this.sendData(xhr, method, data);
            retriesCount--;
          }, 100);
        } else {
          reject(event);
        }
      };

      xhr.ontimeout = (event) => reject(event);
      xhr.onabort = (event) => reject(event);

      this.sendData(xhr, method, data);
    });
  }
}

export { HTTPTransport };
