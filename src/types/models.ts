export interface Task {
    id?: string
    titulo: string
    descricao: string
    concluida: boolean
    urgente: boolean
    projeto: string
}

export interface Project { 
    id?: string
    name: string
    total: number
    pendentes: number
    concluidas: number
    urgentes: number
}