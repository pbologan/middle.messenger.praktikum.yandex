enum METHOD {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

interface DataObject {
  [key: string]: string
}

interface Options {
  data: Data;
  method: METHOD,
  headers?: Pair<string, string>[],
  retries?: number,
  timeout?: number;
}

function queryStringify(data: Data) {
  const dataItems = data.items;

  if (dataItems.length === 0) {
    return '';
  }

  return `?${dataItems
    .map((item: Pair<string, string>) => `${item.key}=${item.value}`)
    .join('&')}`;
}

export default class HTTPTransport {
  get(url: string, options: Options) {
    return this.request(
      url + queryStringify(options.data),
      { ...options, method: METHOD.GET },
      options.timeout,
    );
  }

  put(url: string, options: Options) {
    return this.request(url, { ...options, method: METHOD.PUT }, options.timeout);
  }

  post(url: string, options: Options) {
    return this.request(url, { ...options, method: METHOD.POST }, options.timeout);
  }

  delete(url: string, options: Options) {
    return this.request(url, { ...options, method: METHOD.DELETE }, options.timeout);
  }

  // eslint-disable-next-line class-methods-use-this
  private sendData(xhr: XMLHttpRequest, data: Data, method: METHOD) {
    if (!data || method === METHOD.GET) {
      xhr.send();
    } else {
      const dataForSend = {} as any;
      data.items.forEach((item: Pair<string, string>) => {
        dataForSend[item.key] = item.value;
      });
      xhr.send(JSON.stringify(dataForSend));
    }
  }

  request(url: string, options: Options, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const {
        headers = [], retries = 0, method, data,
      } = options;

      let retriesCount = retries;

      if (!method) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No method provided');
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.timeout = timeout;

      headers.forEach((item: Pair<string, string>) => {
        xhr.setRequestHeader(item.key, item.value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onerror = (event) => {
        if (retriesCount > 0) {
          setTimeout(() => {
            xhr.open(method, url);
            this.sendData(xhr, data, method);
            // eslint-disable-next-line no-plusplus
            retriesCount--;
          }, 100);
        } else {
          reject(event);
        }
      };

      xhr.ontimeout = (event) => reject(event);
      xhr.onabort = (event) => reject(event);

      this.sendData(xhr, data, method);
    });
  }
}
