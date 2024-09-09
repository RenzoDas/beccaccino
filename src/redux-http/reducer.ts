import {
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_REQUEST,
  BindedActionResultPayload,
  REDUX_HTTP_CLIENT_CLEAR,
} from './actions';
import { defaultSession } from '../Beccaccino';

const initialState = {
  results: {},
  requestsMetadata: {},
  requestsLog: { [defaultSession]: {} },
};

export const BECCACCINO_REDUCER_NAME = 'beccaccino_reducer';

export function beccaccinoReducer(
  state: any = initialState,
  action: BindedActionResultPayload,
): any {
  const sessionId = action.requestDetails.sessionId || defaultSession;
  switch (action.type) {
    case REDUX_HTTP_CLIENT_REQUEST:
      const endpointMetadata =
        (state.requestsLog[sessionId] || {})[action.requestDetails.endpointName]
        || { requests: [] };

      return {
        ...state,
        requestsMetadata: {
          ...state.requestsMetadata,
          [action.requestDetails.requestId]: {
            isLoading: true,
            success: undefined,
          },
        },
        requestsLog: {
          ...state.requestsLog,
          [sessionId]: {
            ...state.requestsLog[sessionId] || {},
            [action.requestDetails.endpointName]: {
              ...endpointMetadata,
              requests: [
                ...endpointMetadata.requests,
                action.requestDetails.requestId,
              ],
            },
          },
        },
      };
    case REDUX_HTTP_CLIENT_RESPONSE:
    case REDUX_HTTP_CLIENT_ERROR:
      return {
        ...state,
        results: {
          ...state.results,
          [action.requestDetails.requestId]: {
            ...(state.results[action.requestDetails.requestId] || {}),
            requestDetails: action.requestDetails,
            rawResponse: action.response.rawResponse,
            response: action.response.data,
          },
        },
        requestsMetadata: {
          ...state.requestsMetadata,
          [action.requestDetails.requestId]: {
            isLoading: false,
            success: action.response.success,
          },
        },
      };
      case REDUX_HTTP_CLIENT_CLEAR:
        const { requestId, endpointName } = action.requestDetails;
        const newResults = { ...state.results };
        const newRequestsMetadata = { ...state.requestsMetadata };
        
        if (newResults[requestId]) {
          delete newResults[requestId];
        }
        if (newRequestsMetadata[requestId]) {
          delete newRequestsMetadata[requestId];
        }
        
        return {
          ...state,
          results: newResults,
          requestsMetadata: newRequestsMetadata,
          requestsLog: {
            ...state.requestsLog,
            [sessionId]: {
              ...state.requestsLog[sessionId],
              [endpointName]: {
                ...state.requestsLog[sessionId][endpointName],
                requests: state.requestsLog[sessionId][endpointName].requests.filter(
                  (id: string) => id !== requestId
                ),
              },
            },
          },
        };
    default:
      return state;
  }
}
