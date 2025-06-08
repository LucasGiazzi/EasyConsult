/**
 * Módulo Observer para notificação de eventos do sistema EasyConsult
 * 
 * Implementa o padrão de projeto Observer (GoF) para permitir que componentes
 * se inscrevam para receber notificações quando eventos específicos ocorrerem.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Responsável apenas pelo gerenciamento de eventos
 * - Open/Closed Principle: Aberto para extensão (novos tipos de eventos) sem modificação
 * - Interface Segregation Principle: Interfaces específicas para Subject e Observer
 */

/**
 * Classe EventEmitter - implementa o padrão Observer
 * Permite que componentes se inscrevam e recebam notificações de eventos
 */
class EventEmitter {
    constructor() {
        // Mapa de eventos e seus observadores
        this.events = {};
    }
    
    /**
     * Inscreve um observador para um evento específico
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função a ser chamada quando o evento ocorrer
     * @returns {Function} Função para cancelar a inscrição
     */
    subscribe(event, callback) {
        // Cria o array de callbacks para o evento se não existir
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        // Adiciona o callback à lista de observadores
        this.events[event].push(callback);
        
        // Retorna uma função para cancelar a inscrição
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }
    
    /**
     * Emite um evento, notificando todos os observadores inscritos
     * @param {string} event - Nome do evento
     * @param {*} data - Dados a serem passados para os observadores
     */
    emit(event, data) {
        // Verifica se existem observadores para o evento
        if (this.events[event]) {
            // Notifica todos os observadores
            this.events[event].forEach(callback => {
                callback(data);
            });
        }
    }
    
    /**
     * Remove todos os observadores de um evento específico
     * @param {string} event - Nome do evento
     */
    clearEvent(event) {
        if (this.events[event]) {
            delete this.events[event];
        }
    }
    
    /**
     * Remove todos os observadores de todos os eventos
     */
    clearAll() {
        this.events = {};
    }
}

// Cria uma instância global do EventEmitter
const eventEmitter = new EventEmitter();

/**
 * Comentário explicativo sobre o padrão Observer:
 * 
 * O padrão Observer define uma dependência um-para-muitos entre objetos, de modo que
 * quando um objeto muda de estado, todos os seus dependentes são notificados e
 * atualizados automaticamente.
 * 
 * Implementação:
 * 1. A classe EventEmitter mantém uma lista de observadores para diferentes eventos
 * 2. O método 'subscribe' permite que componentes se inscrevam para receber notificações
 * 3. O método 'emit' notifica todos os observadores inscritos quando um evento ocorre
 * 
 * Benefícios no contexto:
 * - Desacopla os componentes que geram eventos dos que reagem a eles
 * - Permite adicionar novos observadores sem modificar o código existente
 * - Facilita a comunicação entre componentes sem criar dependências diretas
 * - Ideal para atualizar a interface quando o estado dos dados muda
 * 
 * Eventos do sistema:
 * - 'paciente:created' - Quando um novo paciente é criado
 * - 'paciente:updated' - Quando um paciente é atualizado
 * - 'paciente:deleted' - Quando um paciente é excluído
 * - 'profissional:created' - Quando um novo profissional é criado
 * - 'profissional:updated' - Quando um profissional é atualizado
 * - 'profissional:deleted' - Quando um profissional é excluído
 * - 'consulta:created' - Quando uma nova consulta é agendada
 * - 'consulta:updated' - Quando uma consulta é atualizada
 * - 'consulta:deleted' - Quando uma consulta é cancelada
 */

