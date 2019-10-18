import { environment } from '../../environments/environment';

export const getUrlForEndpoint = (url: string) => {
  return environment.serverHost + url;
};
