/**
 * Controlador de Pacientes para o sistema EasyConsult
 * 
 * Responsável por gerenciar as operações relacionadas a pacientes.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas pelas operações de pacientes
 * - Open/Closed Principle: Extensível para novas operações sem modificar o código existente
 * - Dependency Inversion Principle: Depende de abstrações (serviços) e não de implementações concretas
 */
class PacienteController {
    constructor() {
        // Inicializa o serviço de armazenamento para pacientes
        this.storageService = new StorageService('pacientes');
        
        // Referências aos elementos do DOM
        this.formPaciente = document.getElementById('form-paciente');
        this.listaPacientes = document.getElementById('lista-pacientes');
        
        // Inicializa os eventos
        this.inicializarEventos();
        
        // Carrega os pacientes existentes
        this.carregarPacientes();
    }
    
    /**
     * Inicializa os eventos do controlador
     */
    inicializarEventos() {
        // Evento de submissão do formulário de paciente
        this.formPaciente.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarPaciente();
        });
        
        // Inscreve-se para eventos relacionados a pacientes
        eventEmitter.subscribe('paciente:created', () => this.carregarPacientes());
        eventEmitter.subscribe('paciente:updated', () => this.carregarPacientes());
        eventEmitter.subscribe('paciente:deleted', () => this.carregarPacientes());
    }
    
    /**
     * Salva um novo paciente ou atualiza um existente
     */
    salvarPaciente() {
        // Obtém os valores do formulário
        const id = this.formPaciente.dataset.id || null;
        const nome = document.getElementById('nome-paciente').value;
        const email = document.getElementById('email-paciente').value;
        const telefone = document.getElementById('telefone-paciente').value;
        const dataNascimento = document.getElementById('data-nascimento').value;
        
        // Cria ou atualiza o paciente usando o Factory
        const paciente = EntityFactory.create('paciente', {
            id,
            nome,
            email,
            telefone,
            dataNascimento
        });
        
        // Salva o paciente
        const sucesso = this.storageService.save(paciente.toJSON());
        
        if (sucesso) {
            // Limpa o formulário
            this.formPaciente.reset();
            this.formPaciente.dataset.id = '';
            
            // Emite evento de criação ou atualização
            const evento = id ? 'paciente:updated' : 'paciente:created';
            eventEmitter.emit(evento, paciente);
            
            // Exibe mensagem de sucesso
            alert(`Paciente ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        } else {
            // Exibe mensagem de erro
            alert(`Erro ao ${id ? 'atualizar' : 'cadastrar'} paciente.`);
        }
    }
    
    /**
     * Carrega a lista de pacientes
     */
    carregarPacientes() {
        // Limpa a lista atual
        this.listaPacientes.innerHTML = '';
        
        // Obtém todos os pacientes
        const pacientes = this.storageService.getAll();
        
        if (pacientes.length === 0) {
            // Exibe mensagem quando não há pacientes
            this.listaPacientes.innerHTML = '<li class="lista-item">Nenhum paciente cadastrado.</li>';
            return;
        }
        
        // Adiciona cada paciente à lista
        pacientes.forEach(pacienteData => {
            const paciente = Paciente.fromJSON(pacienteData);
            
            const li = document.createElement('li');
            li.className = 'lista-item';
            
            li.innerHTML = `
                <div class="lista-item-info">
                    <div class="lista-item-nome">${paciente.nome}</div>
                    <div class="lista-item-detalhe">
                        ${paciente.email} | ${paciente.telefone} | 
                        ${config.formatDate(paciente.dataNascimento)}
                        ${paciente.getIdade() ? ` (${paciente.getIdade()} anos)` : ''}
                    </div>
                </div>
                <div class="acoes">
                    <button class="btn-acao editar" data-id="${paciente.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao excluir" data-id="${paciente.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Adiciona evento para editar paciente
            li.querySelector('.editar').addEventListener('click', () => {
                this.editarPaciente(paciente.id);
            });
            
            // Adiciona evento para excluir paciente
            li.querySelector('.excluir').addEventListener('click', () => {
                this.excluirPaciente(paciente.id);
            });
            
            this.listaPacientes.appendChild(li);
        });
    }
    
    /**
     * Carrega um paciente para edição
     * @param {string} id - ID do paciente
     */
    editarPaciente(id) {
        const pacienteData = this.storageService.getById(id);
        
        if (pacienteData) {
            const paciente = Paciente.fromJSON(pacienteData);
            
            // Preenche o formulário com os dados do paciente
            document.getElementById('nome-paciente').value = paciente.nome;
            document.getElementById('email-paciente').value = paciente.email;
            document.getElementById('telefone-paciente').value = paciente.telefone;
            document.getElementById('data-nascimento').value = paciente.dataNascimento;
            
            // Marca o formulário para edição
            this.formPaciente.dataset.id = paciente.id;
            
            // Rola a página até o formulário
            document.getElementById('form-paciente').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Exclui um paciente
     * @param {string} id - ID do paciente
     */
    excluirPaciente(id) {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            const sucesso = this.storageService.remove(id);
            
            if (sucesso) {
                // Emite evento de exclusão
                eventEmitter.emit('paciente:deleted', { id });
                
                // Exibe mensagem de sucesso
                alert('Paciente excluído com sucesso!');
            } else {
                // Exibe mensagem de erro
                alert('Erro ao excluir paciente.');
            }
        }
    }
    
    /**
     * Obtém todos os pacientes
     * @returns {Array} Lista de pacientes
     */
    obterTodosPacientes() {
        return this.storageService.getAll().map(pacienteData => 
            Paciente.fromJSON(pacienteData)
        );
    }
    
    /**
     * Obtém um paciente pelo ID
     * @param {string} id - ID do paciente
     * @returns {Paciente|null} Paciente encontrado ou null
     */
    obterPacientePorId(id) {
        const pacienteData = this.storageService.getById(id);
        return pacienteData ? Paciente.fromJSON(pacienteData) : null;
    }
}

