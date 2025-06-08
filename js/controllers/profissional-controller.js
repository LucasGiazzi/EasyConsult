/**
 * Controlador de Profissionais para o sistema EasyConsult
 * 
 * Responsável por gerenciar as operações relacionadas a profissionais de saúde.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas pelas operações de profissionais
 * - Open/Closed Principle: Extensível para novas operações sem modificar o código existente
 * - Dependency Inversion Principle: Depende de abstrações (serviços) e não de implementações concretas
 */
class ProfissionalController {
    constructor() {
        // Inicializa o serviço de armazenamento para profissionais
        this.storageService = new StorageService('profissionais');
        
        // Referências aos elementos do DOM
        this.formProfissional = document.getElementById('form-profissional');
        this.listaProfissionais = document.getElementById('lista-profissionais');
        
        // Inicializa os eventos
        this.inicializarEventos();
        
        // Carrega os profissionais existentes
        this.carregarProfissionais();
    }
    
    /**
     * Inicializa os eventos do controlador
     */
    inicializarEventos() {
        // Evento de submissão do formulário de profissional
        this.formProfissional.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarProfissional();
        });
        
        // Inscreve-se para eventos relacionados a profissionais
        eventEmitter.subscribe('profissional:created', () => this.carregarProfissionais());
        eventEmitter.subscribe('profissional:updated', () => this.carregarProfissionais());
        eventEmitter.subscribe('profissional:deleted', () => this.carregarProfissionais());
    }
    
    /**
     * Salva um novo profissional ou atualiza um existente
     */
    salvarProfissional() {
        // Obtém os valores do formulário
        const id = this.formProfissional.dataset.id || null;
        const nome = document.getElementById('nome-profissional').value;
        const especialidade = document.getElementById('especialidade').value;
        const crm = document.getElementById('crm').value;
        const email = document.getElementById('email-profissional').value;
        
        // Cria ou atualiza o profissional usando o Factory
        const profissional = EntityFactory.create('profissional', {
            id,
            nome,
            especialidade,
            crm,
            email
        });
        
        // Salva o profissional
        const sucesso = this.storageService.save(profissional.toJSON());
        
        if (sucesso) {
            // Limpa o formulário
            this.formProfissional.reset();
            this.formProfissional.dataset.id = '';
            
            // Emite evento de criação ou atualização
            const evento = id ? 'profissional:updated' : 'profissional:created';
            eventEmitter.emit(evento, profissional);
            
            // Exibe mensagem de sucesso
            alert(`Profissional ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        } else {
            // Exibe mensagem de erro
            alert(`Erro ao ${id ? 'atualizar' : 'cadastrar'} profissional.`);
        }
    }
    
    /**
     * Carrega a lista de profissionais
     */
    carregarProfissionais() {
        // Limpa a lista atual
        this.listaProfissionais.innerHTML = '';
        
        // Obtém todos os profissionais
        const profissionais = this.storageService.getAll();
        
        if (profissionais.length === 0) {
            // Exibe mensagem quando não há profissionais
            this.listaProfissionais.innerHTML = '<li class="lista-item">Nenhum profissional cadastrado.</li>';
            return;
        }
        
        // Adiciona cada profissional à lista
        profissionais.forEach(profissionalData => {
            const profissional = Profissional.fromJSON(profissionalData);
            
            const li = document.createElement('li');
            li.className = 'lista-item';
            
            li.innerHTML = `
                <div class="lista-item-info">
                    <div class="lista-item-nome">${profissional.nome}</div>
                    <div class="lista-item-detalhe">
                        ${profissional.especialidade} | CRM: ${profissional.crm} | ${profissional.email}
                    </div>
                </div>
                <div class="acoes">
                    <button class="btn-acao editar" data-id="${profissional.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao excluir" data-id="${profissional.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Adiciona evento para editar profissional
            li.querySelector('.editar').addEventListener('click', () => {
                this.editarProfissional(profissional.id);
            });
            
            // Adiciona evento para excluir profissional
            li.querySelector('.excluir').addEventListener('click', () => {
                this.excluirProfissional(profissional.id);
            });
            
            this.listaProfissionais.appendChild(li);
        });
    }
    
    /**
     * Carrega um profissional para edição
     * @param {string} id - ID do profissional
     */
    editarProfissional(id) {
        const profissionalData = this.storageService.getById(id);
        
        if (profissionalData) {
            const profissional = Profissional.fromJSON(profissionalData);
            
            // Preenche o formulário com os dados do profissional
            document.getElementById('nome-profissional').value = profissional.nome;
            document.getElementById('especialidade').value = profissional.especialidade;
            document.getElementById('crm').value = profissional.crm;
            document.getElementById('email-profissional').value = profissional.email;
            
            // Marca o formulário para edição
            this.formProfissional.dataset.id = profissional.id;
            
            // Rola a página até o formulário
            document.getElementById('form-profissional').scrollIntoView({ behavior: 'smooth' });
            
            // Ativa a aba de profissionais
            document.querySelector('.tab-item[data-tab="profissionais"]').click();
        }
    }
    
    /**
     * Exclui um profissional
     * @param {string} id - ID do profissional
     */
    excluirProfissional(id) {
        if (confirm('Tem certeza que deseja excluir este profissional?')) {
            const sucesso = this.storageService.remove(id);
            
            if (sucesso) {
                // Emite evento de exclusão
                eventEmitter.emit('profissional:deleted', { id });
                
                // Exibe mensagem de sucesso
                alert('Profissional excluído com sucesso!');
            } else {
                // Exibe mensagem de erro
                alert('Erro ao excluir profissional.');
            }
        }
    }
    
    /**
     * Obtém todos os profissionais
     * @returns {Array} Lista de profissionais
     */
    obterTodosProfissionais() {
        return this.storageService.getAll().map(profissionalData => 
            Profissional.fromJSON(profissionalData)
        );
    }
    
    /**
     * Obtém um profissional pelo ID
     * @param {string} id - ID do profissional
     * @returns {Profissional|null} Profissional encontrado ou null
     */
    obterProfissionalPorId(id) {
        const profissionalData = this.storageService.getById(id);
        return profissionalData ? Profissional.fromJSON(profissionalData) : null;
    }
    
    /**
     * Preenche um select com os profissionais disponíveis
     * @param {HTMLSelectElement} selectElement - Elemento select a ser preenchido
     * @param {string} [selectedId] - ID do profissional a ser selecionado
     */
    preencherSelectProfissionais(selectElement, selectedId = '') {
        // Limpa as opções atuais, mantendo apenas a primeira (placeholder)
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        
        // Obtém todos os profissionais
        const profissionais = this.obterTodosProfissionais();
        
        // Adiciona cada profissional como uma opção
        profissionais.forEach(profissional => {
            const option = document.createElement('option');
            option.value = profissional.id;
            option.textContent = `${profissional.nome} - ${profissional.especialidade}`;
            option.selected = profissional.id === selectedId;
            selectElement.appendChild(option);
        });
    }
}

