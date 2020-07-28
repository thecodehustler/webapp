import Axios from 'axios';
import debounce from 'debounce-promise';

export enum SearchState {
    PENDING,
    ONGOING,
    ERROR
}

export interface SearchResult {
  name: string;
  description: string;
}

function doQuery(nameQuery: string): Promise<any> {
  if (nameQuery !== '') {
    console.log('query', nameQuery);
    return Axios.get("/api/search", {
      params: {
        name: nameQuery
      }
    });
  } else {
    throw new TypeError('Expected a non-empty string.');
  }
}

/**
 * Generate a debounced searching executor (Powered by debounce-promise).
 * @param {Number} timeout - Waiting timeout for debounce-promise.
 */
export function debouncedSearch(timeout = 500) :Function {
  return debounce(doQuery, timeout);
}