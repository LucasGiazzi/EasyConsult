/**
 * Serviço de Armazenamento para o sistema EasyConsult
 * 
 * Responsável por persistir e recuperar dados do localStorage do navegador.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas pelo armazenamento de dados
 * - Open/Closed Principle: Extensível para novos tipos de entidades sem modificação
 * - Dependency Inversion Principle: Depende de abstrações (interface de armazenamento)
 */
class StorageService {
    /**
     * Cria uma nova instância do serviço de armazenamento
     * @param {string} entityName - Nome da entidade a ser gerenciada
     */
    constructor(entityName) {
        this.entityName = entityName;
        this.storageKey = config.getStorageKey(entityName);
    }
    
    /**
     * Obtém todos os itens armazenados
     * @returns {Array} Lista de itens
     */
    getAll() {
        try {
            const items = localStorage.getItem(this.storageKey);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error(`Erro ao obter ${this.entityName}:`, error);
            return [];
        }
    }
    
    /**
     * Obtém um item pelo ID
     * @param {string} id - ID do item
     * @returns {Object|null} Item encontrado ou null
     */
    getById(id) {
        try {
            const items = this.getAll();
            return items.find(item => item.id === id) || null;
        } catch (error) {
            console.error(`Erro ao obter ${this.entityName} por ID:`, error);
            return null;
        }
    }
    
    /**
     Salva um item no localStorage, atualizando se já existe ou adicionando se for novo
     * @param {Object} item - Item a ser salvo
     * @returns {boolean} True se salvo com sucesso, False caso contrário
     */
    save(item) {
        try {
            const items = this.getAll();
            const index = items.findIndex(i => i.id === item.id);
            
            if (index >= 0) {
                // Atualiza item existente
                items[index] = item;
            } else {
                // Adiciona novo item
                items.push(item);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error(`Erro ao salvar ${this.entityName}:`, error);
            return false;
        }
    }
    
    /**
     * Remove um item pelo ID
     * @param {string} id - ID do item a ser removido
     * @returns {boolean} True se removido com sucesso, False caso contrário
     */
    remove(id) {
        try {
            const items = this.getAll();
            const filteredItems = items.filter(item => item.id !== id);
            
            if (filteredItems.length < items.length) {
                localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`Erro ao remover ${this.entityName}:`, error);
            return false;
        }
    }
    
    /**
     * Remove todos os itens
     * @returns {boolean} True se removidos com sucesso, False caso contrário
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error(`Erro ao limpar ${this.entityName}:`, error);
            return false;
        }
    }
    
    /**
     * Filtra itens com base em critérios
     * @param {Function} filterFn - Função de filtro
     * @returns {Array} Itens filtrados
     */
    filter(filterFn) {
        try {
            const items = this.getAll();
            return items.filter(filterFn);
        } catch (error) {
            console.error(`Erro ao filtrar ${this.entityName}:`, error);
            return [];
        }
    }
}

/**
 * Comentário explicativo sobre o uso do localStorage:
 * 
 * O localStorage é uma API do navegador que permite armazenar dados no formato
 * chave-valor de forma persistente, mesmo após o fechamento do navegador.
 * 
 * Limitações:
 * - Armazena apenas strings (por isso usamos JSON.stringify/parse)
 * - Limite de armazenamento (geralmente 5-10MB por domínio)
 * - Não é adequado para dados sensíveis (não é criptografado)
 * - Síncrono (pode bloquear a thread principal em operações grandes)
 * 
 * No contexto acadêmico deste projeto, o localStorage é uma escolha adequada
 * para simular um banco de dados, permitindo persistência de dados sem
 * necessidade de um backend real.
 */

