/**
 * Classe Paciente - Modelo de dados para pacientes no sistema EasyConsult
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas por representar um paciente
 * - Open/Closed Principle: Extensível sem modificação através de métodos bem definidos
 */
class Paciente {
    /**
     * Cria uma nova instância de Paciente
     * @param {string} id - Identificador único do paciente
     * @param {string} nome - Nome completo do paciente
     * @param {string} email - Email do paciente
     * @param {string} telefone - Telefone do paciente
     * @param {string} dataNascimento - Data de nascimento do paciente (formato YYYY-MM-DD)
     */
    constructor(id, nome, email, telefone, dataNascimento) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.dataCadastro = new Date().toISOString();
    }
    
    /**
     * Retorna a idade do paciente
     * @returns {number} Idade em anos
     */
    getIdade() {
        if (!this.dataNascimento) return null;
        
        const hoje = new Date();
        const nascimento = new Date(this.dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        
        // Ajusta a idade se ainda não fez aniversário este ano
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    /**
     * Converte o objeto para formato JSON
     * @returns {Object} Representação do paciente em formato JSON
     */
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            dataNascimento: this.dataNascimento,
            dataCadastro: this.dataCadastro
        };
    }
    
    /**
     * Cria uma instância de Paciente a partir de um objeto JSON
     * @param {Object} json - Objeto JSON com dados do paciente
     * @returns {Paciente} Nova instância de Paciente
     */
    static fromJSON(json) {
        const paciente = new Paciente(
            json.id,
            json.nome,
            json.email,
            json.telefone,
            json.dataNascimento
        );
        paciente.dataCadastro = json.dataCadastro || new Date().toISOString();
        return paciente;
    }
}

