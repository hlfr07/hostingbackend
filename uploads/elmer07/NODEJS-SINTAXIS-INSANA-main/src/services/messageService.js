class MessageService {
  getMessage() {
    return {
      text: "¡Estás usando el servicio de mensajes!",
      data: [
        { id: 1, name: "Juan" },
        { id: 2, name: "María" },
        { id: 3, name: "Pedro" }
      ]
    };
  }
}

module.exports = MessageService;