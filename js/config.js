/**
 * Módulo de Configuração do Sistema EasyConsult
 * 
 * Implementa o padrão de projeto Singleton (GoF) para garantir uma única instância
 * de configuração em toda a aplicação.
 * 
 * Princípio SOLID aplicado:
 * - Single Responsibility Principle: Este módulo tem a única responsabilidade de
 *   gerenciar as configurações do sistema.
 */

class Config {
    constructor() {
        // Verifica se já existe uma instância
        if (Config.instance) {
            return Config.instance;
        }
        
        // Configurações do sistema
        this._config = {
            appName: 'EasyConsult',
            version: '1.0.0',
            storagePrefix: 'easyConsult_',
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'HH:mm',
            maxConsultasPerDay: 20,
            debugMode: false
        };
        
        // Armazena a instância para garantir o Singleton
        Config.instance = this;
    }
    
    /**
     * Obtém uma configuração específica
     * @param {string} key - Chave da configuração
     * @returns {*} Valor da configuração
     */
    get(key) {
        return this._config[key];
    }
    
    /**
     * Define uma configuração específica
     * @param {string} key - Chave da configuração
     * @param {*} value - Valor da configuração
     */
    set(key, value) {
        this._config[key] = value;
        return this;
    }
    
    /**
     * Obtém o prefixo de armazenamento para localStorage
     * @returns {string} Prefixo de armazenamento
     */
    getStorageKey(key) {
        return `${this._config.storagePrefix}${key}`;
    }
    
    /**
     * Formata uma data conforme configuração
     * @param {Date} date - Data a ser formatada
     * @returns {string} Data formatada
     */
    formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Formata uma hora conforme configuração
     * @param {string} time - Hora a ser formatada (formato HH:mm)
     * @returns {string} Hora formatada
     */
    formatTime(time) {
        return time || '';
    }
    
    /**
     * Gera um ID único
     * @returns {string} ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

// Exporta uma instância única do Config
const config = new Config();

/**
 * Comentário explicativo sobre o padrão Singleton:
 * 
 * O padrão Singleton garante que uma classe tenha apenas uma instância e fornece
 * um ponto global de acesso a ela. Isso é útil para configurações do sistema,
 * onde queremos garantir que todos os componentes acessem os mesmos valores de configuração.
 * 
 * Implementação:
 * 1. O construtor verifica se já existe uma instância (Config.instance)
 * 2. Se existir, retorna a instância existente
 * 3. Se não existir, cria uma nova instância e a armazena em Config.instance
 * 
 * Benefícios no contexto:
 * - Garante consistência nas configurações em toda a aplicação
 * - Evita duplicação de dados de configuração
 * - Fornece um ponto central para gerenciar configurações
 */

