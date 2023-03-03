import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from 'sinon';
import { HTTPTransport } from './http-transport';
import { BASE_URL, USER } from '../urls';

describe('HTTPTransport', () => {
  let xhr: SinonFakeXMLHttpRequestStatic;
  let httpClient: HTTPTransport;
  const requests: SinonFakeXMLHttpRequest[] = [];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    // @ts-ignore
    window.XMLHttpRequest = xhr;
    xhr.onCreate = ((request: SinonFakeXMLHttpRequest) => {
      requests.push(request);
    });
    httpClient = new HTTPTransport(BASE_URL);
  });

  afterEach(() => {
    requests.length = 0;
  });

  it('should send GET request', async () => {
    httpClient.get(USER);

    const [request] = requests;

    expect(request?.method).toEqual('GET');
  });

  it('should send POST request', () => {
    httpClient.post(USER);

    const [request] = requests;

    expect(request?.method).toEqual('POST');
  });

  it('should send PUT request', () => {
    httpClient.put(USER);

    const [request] = requests;

    expect(request?.method).toEqual('PUT');
  });

  it('should send DELETE request', () => {
    httpClient.delete(USER);

    const [request] = requests;

    expect(request?.method).toEqual('DELETE');
  });
});
