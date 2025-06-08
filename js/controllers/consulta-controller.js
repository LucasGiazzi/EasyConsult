/**
 * Controlador de Consultas para o sistema EasyConsult
 * 
 * Responsável por gerenciar as operações relacionadas a consultas.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Classe responsável apenas pelas operações de consultas
 * - Open/Closed Principle: Extensível para novas operações sem modificar o código existente
 * - Dependency Inversion Principle: Depende de abstrações (serviços) e não de implementações concretas
 * - Interface Segregation Principle: Interfaces específicas para diferentes operações
 */
class ConsultaController {
    constructor(pacienteController, profissionalController) {
        // Dependências
        this.pacienteController = pacienteController;
        this.profissionalController = profissionalController;
        
        // Inicializa o serviço de armazenamento para consultas
        this.storageService = new StorageService('consultas');
        
        // Referências aos elementos do DOM
        this.formAgendamento = document.getElementById('form-agendamento');
        this.pacienteSelect = document.getElementById('paciente-select');
        this.profissionalSelect = document.getElementById('profissional-select');
        this.listaConsultas = document.getElementById('lista-consultas');
        this.semConsultas = document.getElementById('sem-consultas');
        this.filtroData = document.getElementById('filtro-data');
        this.filtroProfissional = document.getElementById('filtro-profissional');
        this.btnFiltrar = document.getElementById('btn-filtrar');
        this.btnLimparFiltro = document.getElementById('btn-limpar-filtro');
        
        const dataInput = document.getElementById('data-consulta');

        dataInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

            if (value.length > 8) value = value.slice(0, 8); // Máximo: 8 dígitos

            if (value.length > 4) {
                value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
            } else if (value.length > 2) {
                value = `${value.slice(0, 2)}/${value.slice(2)}`;
            }

            e.target.value = value;
        });


        // Inicializa os eventos
        this.inicializarEventos();
        
        // Preenche os selects
        this.preencherSelects();
        
        // Carrega as consultas existentes
        this.carregarConsultas();
    }
    
    /**
     * Inicializa os eventos do controlador
     */
    inicializarEventos() {
        // Evento de submissão do formulário de agendamento
        this.formAgendamento.addEventListener('submit', (e) => {
            e.preventDefault();
            this.agendarConsulta();
        });
        
        // Eventos de filtro
        this.btnFiltrar.addEventListener('click', () => {
            this.aplicarFiltros();
        });
        
        this.btnLimparFiltro.addEventListener('click', () => {
            this.limparFiltros();
        });
        
        // Inscreve-se para eventos relacionados a consultas
        eventEmitter.subscribe('consulta:created', () => this.carregarConsultas());
        eventEmitter.subscribe('consulta:updated', () => this.carregarConsultas());
        eventEmitter.subscribe('consulta:deleted', () => this.carregarConsultas());
        
        // Inscreve-se para eventos relacionados a pacientes e profissionais
        eventEmitter.subscribe('paciente:created', () => this.preencherSelectPacientes());
        eventEmitter.subscribe('paciente:updated', () => this.preencherSelectPacientes());
        eventEmitter.subscribe('paciente:deleted', () => this.preencherSelectPacientes());
        
        eventEmitter.subscribe('profissional:created', () => this.preencherSelectProfissionais());
        eventEmitter.subscribe('profissional:updated', () => this.preencherSelectProfissionais());
        eventEmitter.subscribe('profissional:deleted', () => this.preencherSelectProfissionais());
    }
    
    /**
     * Preenche os selects de pacientes e profissionais
     */
    preencherSelects() {
        this.preencherSelectPacientes();
        this.preencherSelectProfissionais();
        this.preencherFiltroProfissionais();
    }
    
    /**
     * Preenche o select de pacientes
     */
    preencherSelectPacientes() {
        // Limpa as opções atuais, mantendo apenas a primeira (placeholder)
        while (this.pacienteSelect.options.length > 1) {
            this.pacienteSelect.remove(1);
        }
        
        // Obtém todos os pacientes
        const pacientes = this.pacienteController.obterTodosPacientes();
        
        // Adiciona cada paciente como uma opção
        pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nome;
            this.pacienteSelect.appendChild(option);
        });
    }
    
    /**
     * Preenche o select de profissionais
     */
    preencherSelectProfissionais() {
        this.profissionalController.preencherSelectProfissionais(this.profissionalSelect);
    }
    
    /**
     * Preenche o select de filtro de profissionais
     */
    preencherFiltroProfissionais() {
        this.profissionalController.preencherSelectProfissionais(this.filtroProfissional);
    }
    
    /**
     * Agenda uma nova consulta
     */
    agendarConsulta() {
        // Obtém os valores do formulário
        const id = this.formAgendamento.dataset.id || null;
        const pacienteId = this.pacienteSelect.value;
        const profissionalId = this.profissionalSelect.value;
        const data = document.getElementById('data-consulta').value;
        const hora = document.getElementById('hora-consulta').value;
        const tipo = document.getElementById('tipo-consulta').value;

        console.log(data, hora)
        
        // Validações básicas
        if (!pacienteId || !profissionalId || !data || !hora || !tipo) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Cria ou atualiza a consulta usando o Factory
        const consulta = EntityFactory.create('consulta', {
            id,
            pacienteId,
            profissionalId,
            data,
            hora,
            tipo
        });
        
        // Salva a consulta
        const sucesso = this.storageService.save(consulta.toJSON());
        
        if (sucesso) {
            // Limpa o formulário
            this.formAgendamento.reset();
            this.formAgendamento.dataset.id = '';
            
            // Emite evento de criação ou atualização
            const evento = id ? 'consulta:updated' : 'consulta:created';
            eventEmitter.emit(evento, consulta);
            
            // Exibe mensagem de sucesso
            alert(`Consulta ${id ? 'atualizada' : 'agendada'} com sucesso!`);
            
            // Rola a página até a lista de consultas
            document.getElementById('consultas').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Exibe mensagem de erro
            alert(`Erro ao ${id ? 'atualizar' : 'agendar'} consulta.`);
        }
    }
    
    /**
     * Carrega a lista de consultas
     * @param {Object} filtros - Filtros a serem aplicados
     */
    carregarConsultas(filtros = {}) {
        // Limpa a lista atual
        this.listaConsultas.innerHTML = '';
        
        // Obtém todas as consultas
        let consultas = this.storageService.getAll();
        
        // Aplica filtros, se houver
        if (filtros.data) {
            consultas = consultas.filter(c => c.data === filtros.data);
        }
        
        if (filtros.profissionalId) {
            consultas = consultas.filter(c => c.profissionalId === filtros.profissionalId);
        }
        
        // Ordena por data e hora
        consultas.sort((a, b) => {
            if (a.data !== b.data) {
                return new Date(a.data) - new Date(b.data);
            }
            return a.hora.localeCompare(b.hora);
        });
        
        // Verifica se há consultas
        if (consultas.length === 0) {
            this.semConsultas.style.display = 'flex';
            return;
        }
        
        // Oculta a mensagem de "sem consultas"
        this.semConsultas.style.display = 'none';
        
        // Adiciona cada consulta à tabela
        consultas.forEach(consultaData => {
            const consulta = Consulta.fromJSON(consultaData);
            
            // Obtém dados do paciente e profissional
            const paciente = this.pacienteController.obterPacientePorId(consulta.pacienteId);
            const profissional = this.profissionalController.obterProfissionalPorId(consulta.profissionalId);
            
            if (!paciente || !profissional) return;
            
            const tr = document.createElement('tr');

            const [ano, mes, dia] = consulta.data.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            
            console.log(consulta.hora)
            tr.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${consulta.hora}</td>
                <td>${paciente.nome}</td>
                <td>${profissional.nome}</td>
                <td>${profissional.especialidade}</td>
                <td>${consulta.tipo}</td>
                <td>
                    <div class="acoes">
                        <button class="btn-acao editar" data-id="${consulta.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-acao excluir" data-id="${consulta.id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Adiciona evento para editar consulta
            tr.querySelector('.editar').addEventListener('click', () => {
                this.editarConsulta(consulta.id);
            });
            
            // Adiciona evento para excluir consulta
            tr.querySelector('.excluir').addEventListener('click', () => {
                this.excluirConsulta(consulta.id);
            });
            
            this.listaConsultas.appendChild(tr);
        });
    }
    
    /**
     * Carrega uma consulta para edição
     * @param {string} id - ID da consulta
     */
    editarConsulta(id) {
        const consultaData = this.storageService.getById(id);
        
        if (consultaData) {
            const consulta = Consulta.fromJSON(consultaData);
            
            // Preenche o formulário com os dados da consulta
            this.pacienteSelect.value = consulta.pacienteId;
            this.profissionalSelect.value = consulta.profissionalId;
            document.getElementById('data-consulta').value = consulta.data;
            document.getElementById('hora-consulta').value = consulta.hora;
            document.getElementById('tipo-consulta').value = consulta.tipo;
            
            // Marca o formulário para edição
            this.formAgendamento.dataset.id = consulta.id;
            
            // Rola a página até o formulário
            document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Exclui uma consulta
     * @param {string} id - ID da consulta
     */
    excluirConsulta(id) {
        if (confirm('Tem certeza que deseja excluir esta consulta?')) {
            const sucesso = this.storageService.remove(id);
            
            if (sucesso) {
                // Emite evento de exclusão
                eventEmitter.emit('consulta:deleted', { id });
                
                // Exibe mensagem de sucesso
                alert('Consulta excluída com sucesso!');
            } else {
                // Exibe mensagem de erro
                alert('Erro ao excluir consulta.');
            }
        }
    }
    
    /**
     * Aplica os filtros na lista de consultas
     */
    aplicarFiltros() {
        const filtros = {
            data: this.filtroData.value,
            profissionalId: this.filtroProfissional.value
        };
        
        this.carregarConsultas(filtros);
    }
    
    /**
     * Limpa os filtros e recarrega todas as consultas
     */
    limparFiltros() {
        this.filtroData.value = '';
        this.filtroProfissional.value = '';
        this.carregarConsultas();
    }
}

