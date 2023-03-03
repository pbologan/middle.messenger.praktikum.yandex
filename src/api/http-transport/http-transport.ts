import { isFormData } from '../../utils';

enum Method {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export enum Header {
  CONTENT_TYPE = 'Content-Type',
}

export enum ContentType {
  FORM_DATA = 'multipart/form-data',
  APPLICATION_JSON = 'application/json',
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
    .map((key: string) => {
      const value = data[key];
      if (value !== undefined) {
        return `${key}=${value}`;
      }
      return '';
    })
    .join('&')}`;
}

type HTTPMethod = <R extends unknown = any>(url: string, options?: Options) => Promise<R>;

export class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get: HTTPMethod = (url, options: Options = {}) => {
    const { data } = options;
    const queryString = isFormData(data) ? '' : queryStringify(data);
    return this.request(
      url + queryString,
      { ...options, method: Method.GET },
      options.timeout,
    );
  };

  put: HTTPMethod = (url, options: Options = {}) => {
    return this.request(url, { ...options, method: Method.PUT }, options.timeout);
  };

  post: HTTPMethod = (url, options: Options = {}) => {
    return this.request(url, { ...options, method: Method.POST }, options.timeout);
  };

  delete: HTTPMethod = (url: string, options: Options = {}) => {
    return this.request(url, { ...options, method: Method.DELETE }, options.timeout);
  };

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
      xhr.withCredentials = true;

      if (headers) {
        Object.keys(headers).forEach((key: string) => {
          const header = headers[key];
          if (header) {
            xhr.setRequestHeader(key, header);
          }
        });
      }

      xhr.onload = () => {
        let result;
        try {
          result = JSON.parse(xhr.responseText);
        } catch (e) {
          result = xhr.responseText;
        }

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
