class TicketManager {
    constructor() {
        this.eventos = [];
        this.precioBaseDeGanancia = 0; 
    }

    getEventos() {
        return this.eventos;
    }

    agregarEvento(nombre, lugar, precio, capacidad = 50, fecha = new Date()) {

        const id = this.eventos.length + 1; 
        const participantes = []; 
        const precioFinal = precio + (precio * 0.15);

        const evento = {
            id,
            nombre,
            lugar,
            precio: precioFinal,
            capacidad,
            fecha,
            participantes
        };

        this.eventos.push(evento);
    }

    agregarUsuario(eventoId, usuarioId) {
        const evento = this.eventos.find(evento => evento.id === eventoId);

        if (!evento) {
            console.log("El evento no existe.");
            return;
        }

        if (evento.participantes.includes(usuarioId)) {
            console.log("El usuario ya está registrado en este evento.");
            return;
        }

        evento.participantes.push(usuarioId);
    }

    ponerEventoEnGira(eventoId, nuevaLocalidad, nuevaFecha) {
        const eventoExistente = this.eventos.find(evento => evento.id === eventoId);

        if (!eventoExistente) {
            console.log("El evento no existe.");
            return;
        }

        const eventoNuevo = { ...eventoExistente, lugar: nuevaLocalidad, fecha: nuevaFecha, id: this.eventos.length + 1, participantes: [] };
        this.eventos.push(eventoNuevo);
    }
}


const TM = new TicketManager();
console.log(TM.getEventos());

TM.agregarEvento("Concierto", "Estadio", 100, 1000);
TM.agregarEvento("Feria", "Plaza", 50, 200);
TM.agregarEvento("Partido de baloncesto", "Arena", 75, 300); 
TM.getEventos();
TM.agregarUsuario(1, 1);
TM.agregarUsuario(1, 2);
TM.agregarUsuario(1, 1); 
TM.ponerEventoEnGira(1, "Otro Estadio", new Date(2024, 2, 29));
TM.getEventos();

