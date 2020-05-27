import { ENV_MAP } from './map';

const { DEV, PROD } = ENV_MAP;

export const ENV_ID = {
  [DEV]: 'calendar-dev-00pxg',
  [PROD]: 'calendar-prod-w7kpb',
};

export const ENV = ENV_ID[DEV]; // TODO: 功能上线前改为PROD
