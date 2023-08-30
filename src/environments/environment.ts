export const environment = {
  production: false,
  nodeRed: 'http://localhost:1880',
  ifox: 'https://haw.ifox-systems.de/api/v1',
  mqtt: {
    hostname: 'localhost',
    port: 8081,
    path: '/',
    clean: true, // Retain session
    connectTimeout: 4000, // Timeout period
    reconnectPeriod: 4000, // Reconnect period
    // Authentication information
    clientId: '',
    username: '',
    password: '',
    protocol: 'ws',
  },
};
