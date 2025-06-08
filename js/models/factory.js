/**
 * Módulo Factory para criação de objetos do sistema EasyConsult
 * 
 * Implementa o padrão de projeto Factory Method (GoF) para criar diferentes tipos
 * de objetos do domínio da aplicação.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Responsável apenas pela criação de objetos
 * - Open/Closed Principle: Aberto para extensão (novos tipos) e fechado para modificação
 * - Dependency Inversion Principle: Depende de abstrações, não de implementações concretas
 */

class EntityFactory {
    /**
     * Cria uma nova entidade do tipo especificado
     * @param {string} type - Tipo da entidade ('paciente', 'profissional', 'consulta')
     * @param {Object} data - Dados para criar a entidade
     * @returns {Object} Nova instância da entidade
     */
    static create(type, data = {}) {
        switch (type.toLowerCase()) {
            case 'paciente':
                return this.createPaciente(data);
            case 'profissional':
                return this.createProfissional(data);
            case 'consulta':
                return this.createConsulta(data);
            default:
                throw new Error(`Tipo de entidade não suportado: ${type}`);
        }
    }
    
    /**
     * Cria um novo paciente
     * @param {Object} data - Dados do paciente
     * @returns {Paciente} Nova instância de Paciente
     */
    static createPaciente(data) {
        const id = data.id || config.generateId();
        return new Paciente(
            id,
            data.nome || '',
            data.email || '',
            data.telefone || '',
            data.dataNascimento || ''
        );
    }
    
    /**
     * Cria um novo profissional
     * @param {Object} data - Dados do profissional
     * @returns {Profissional} Nova instância de Profissional
     */
    static createProfissional(data) {
        const id = data.id || config.generateId();
        return new Profissional(
            id,
            data.nome || '',
            data.especialidade || '',
            data.crm || '',
            data.email || ''
        );
    }
    
    /**
     * Cria uma nova consulta
     * @param {Object} data - Dados da consulta
     * @returns {Consulta} Nova instância de Consulta
     */
    static createConsulta(data) {
        const id = data.id || config.generateId();
        return new Consulta(
            id,
            data.pacienteId || '',
            data.profissionalId || '',
            data.data || '',
            data.hora || '',
            data.tipo || ''
        );
    }
}

/**
 * Comentário explicativo sobre o padrão Factory Method:
 * 
 * O padrão Factory Method define uma interface para criar objetos, mas permite que
 * as subclasses decidam quais classes instanciar. Neste caso, implementamos uma
 * versão simplificada onde a classe EntityFactory encapsula a lógica de criação
 * de diferentes tipos de entidades.
 * 
 * Implementação:
 * 1. O método estático 'create' recebe o tipo de entidade e os dados necessários
 * 2. Dependendo do tipo, chama o método específico para criar a entidade
 * 3. Cada método de criação específico instancia o objeto com os dados fornecidos
 * 
 * Benefícios no contexto:
 * - Centraliza a lógica de criação de objetos
 * - Facilita a manutenção e extensão (adicionar novos tipos de entidades)
 * - Encapsula a lógica de inicialização de objetos
 * - Permite validações e transformações de dados antes da criação
 */

