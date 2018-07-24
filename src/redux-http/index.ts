import { EndpointResponse } from '@lib/endpoint';

export const REDUX_HTTP_CLIENT_REQUEST = '@@redux_http_client/request';
export const REDUX_HTTP_CLIENT_ERROR = '@@redux_http_client/error';
export const REDUX_HTTP_CLIENT_RESPONSE = '@@redux_http_client/response';

export const REDUX_HTTP_ACTION_SIGNATURE = Symbol('REDUX:HTTP_CLIENT_ACTION');

export type BindedRequestDetails = {
  urlParams: any,
  requestPayload: any,
  endpointName: string,
  requestId: string,
};

export type BindedActionPayload = {
  type: string,
  signature: Symbol,
  requestDetails: BindedRequestDetails,
  execAsync: Promise<EndpointResponse>,
};

export type BindedActionResultPayload = {
  type: string,
  requestDetails: BindedRequestDetails,
  response: EndpointResponse,
};

export type BaseSelectorMapper = {
  responseMapper?: (meta: any, response: any) => any,
};

export type SelectorInput = {
  state: any,
  endpointName: string,
  limit?: number,
};

export type BaseSelectorInput = BaseSelectorMapper & SelectorInput;

export type SelectorOutput = {
  result: any,
  metadata: any,
};

export { default as reduxHttpMiddleware } from '@lib/redux-http/middleware';
export { default as reduxHttpReducer } from '@lib/redux-http/reducer';
export { REDUX_HTTP_CLIENT_REDUCER_NAME } from '@lib/redux-http/reducer';
export * from '@lib/redux-http/selectors';
