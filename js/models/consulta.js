/**
 * Classe Consulta - Modelo de dados para consultas no sistema EasyConsult
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas por representar uma consulta
 * - Open/Closed Principle: Extensível sem modificação através de métodos bem definidos
 */
class Consulta {
    /**
     * Cria uma nova instância de Consulta
     * @param {string} id - Identificador único da consulta
     * @param {string} pacienteId - ID do paciente
     * @param {string} profissionalId - ID do profissional
     * @param {string} data - Data da consulta (formato YYYY-MM-DD)
     * @param {string} hora - Hora da consulta (formato HH:MM)
     * @param {string} tipo - Tipo da consulta (Primeira Consulta, Retorno, Exame)
     */
    constructor(id, pacienteId, profissionalId, data, hora, tipo) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.profissionalId = profissionalId;
        this.data = data;
        this.hora = hora;
        this.tipo = tipo;
        this.status = 'Agendada'; // Agendada, Confirmada, Realizada, Cancelada
        this.dataAgendamento = new Date().toISOString();
    }
    
    /**
     * Verifica se a consulta está agendada para uma data futura
     * @returns {boolean} True se a consulta for no futuro, False caso contrário
     */
    isFutura() {
        if (!this.data) return false;
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const dataConsulta = new Date(this.data);
        dataConsulta.setHours(0, 0, 0, 0);
        
        return dataConsulta >= hoje;
    }
    
    /**
     * Altera o status da consulta
     * @param {string} novoStatus - Novo status da consulta
     */
    alterarStatus(novoStatus) {
        const statusValidos = ['Agendada', 'Confirmada', 'Realizada', 'Cancelada'];
        
        if (statusValidos.includes(novoStatus)) {
            this.status = novoStatus;
        } else {
            throw new Error(`Status inválido: ${novoStatus}`);
        }
    }
    
    /**
     * Converte o objeto para formato JSON
     * @returns {Object} Representação da consulta em formato JSON
     */
    toJSON() {
        return {
            id: this.id,
            pacienteId: this.pacienteId,
            profissionalId: this.profissionalId,
            data: this.data,
            hora: this.hora,
            tipo: this.tipo,
            status: this.status,
            dataAgendamento: this.dataAgendamento
        };
    }
    
    /**
     * Cria uma instância de Consulta a partir de um objeto JSON
     * @param {Object} json - Objeto JSON com dados da consulta
     * @returns {Consulta} Nova instância de Consulta
     */
    static fromJSON(json) {
        const consulta = new Consulta(
            json.id,
            json.pacienteId,
            json.profissionalId,
            json.data,
            json.hora,
            json.tipo
        );
        consulta.status = json.status || 'Agendada';
        consulta.dataAgendamento = json.dataAgendamento || new Date().toISOString();
        return consulta;
    }
}

