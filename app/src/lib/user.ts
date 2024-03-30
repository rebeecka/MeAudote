export interface User {
    id: string
    name: string,
    email: string,
    phone: string,
    image: string
}

export class Registro {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public password?: string,
        public image?: string,
    ) {}
}