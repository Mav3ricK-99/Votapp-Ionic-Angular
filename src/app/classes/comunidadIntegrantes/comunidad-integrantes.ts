export class ComunidadIntegrantes {

    constructor(public id: number,
        public votar: boolean,
        public crearVotacion: boolean,
        public porcentaje: number,
        public requiereAceptacion: boolean,
        public fEnvioInvitacion: Date,
        public fDecision: Date,
        public aceptacion: boolean,
        public habilitado: boolean,
        public created_at: Date) { }
}
