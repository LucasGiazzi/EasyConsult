/**
 * Classe Profissional - Modelo de dados para profissionais de saúde no sistema EasyConsult
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas por representar um profissional
 * - Open/Closed Principle: Extensível sem modificação através de métodos bem definidos
 */
class Profissional {
    /**
     * Cria uma nova instância de Profissional
     * @param {string} id - Identificador único do profissional
     * @param {string} nome - Nome completo do profissional
     * @param {string} especialidade - Especialidade médica
     * @param {string} crm - Número do CRM (Conselho Regional de Medicina)
     * @param {string} email - Email do profissional
     */
    constructor(id, nome, especialidade, crm, email) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
        this.crm = crm;
        this.email = email;
        this.dataCadastro = new Date().toISOString();
    }
    
    /**
     * Retorna a descrição completa do profissional
     * @returns {string} Descrição no formato "Nome - Especialidade (CRM)"
     */
    getDescricaoCompleta() {
        return `${this.nome} - ${this.especialidade} (CRM: ${this.crm})`;
    }
    
    /**
     * Converte o objeto para formato JSON
     * @returns {Object} Representação do profissional em formato JSON
     */
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            especialidade: this.especialidade,
            crm: this.crm,
            email: this.email,
            dataCadastro: this.dataCadastro
        };
    }
    
    /**
     * Cria uma instância de Profissional a partir de um objeto JSON
     * @param {Object} json - Objeto JSON com dados do profissional
     * @returns {Profissional} Nova instância de Profissional
     */
    static fromJSON(json) {
        const profissional = new Profissional(
            json.id,
            json.nome,
            json.especialidade,
            json.crm,
            json.email
        );
        profissional.dataCadastro = json.dataCadastro || new Date().toISOString();
        return profissional;
    }
}

