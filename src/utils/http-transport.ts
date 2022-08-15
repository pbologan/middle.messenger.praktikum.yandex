enum Method {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

interface DataObject {
  [key: string]: string
}

interface Options {
  data?: DataObject;
  method?: Method,
  headers?: DataObject,
  retries?: number,
  timeout?: number;
}

function queryStringify(data?: DataObject) {
  if (!data || Object.keys(data).length === 0) {
    return '';
  }

  return `?${Object.keys(data)
    .map((key: string) => `${key}=${data[key]}`)
    .join('&')}`;
}

export default class HTTPTransport<R> {
  get(url: string, options: Options): Promise<R> {
    return this.request(
      url + queryStringify(options.data),
      { ...options, method: Method.GET },
      options.timeout,
    );
  }

  put(url: string, options: Options): Promise<R> {
    return this.request(url, { ...options, method: Method.PUT }, options.timeout);
  }

  post(url: string, options: Options): Promise<R> {
    return this.request(url, { ...options, method: Method.POST }, options.timeout);
  }

  delete(url: string, options: Options): Promise<R> {
    return this.request(url, { ...options, method: Method.DELETE }, options.timeout);
  }

  private sendData(xhr: XMLHttpRequest, method: Method, data?: DataObject) {
    if (!data || method === Method.GET) {
      xhr.send();
    } else {
      xhr.send(JSON.stringify(data));
    }
  }

  private request(url: string, options: Options, timeout = 5000): Promise<R> {
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
      xhr.open(method, url);
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
            xhr.open(method, url);
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
