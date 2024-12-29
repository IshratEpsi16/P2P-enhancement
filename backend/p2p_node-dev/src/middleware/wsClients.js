// This module will act as a singleton to manage WebSocket clients
let clients = []; // Array to hold WebSocket clients

module.exports = {
  getClients: () => clients,
  addClient: (client) => clients.push(client),
  removeClient: (client) => {
    clients = clients.filter((c) => c !== client);
  },
};
