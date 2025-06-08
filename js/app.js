/**
 * Arquivo principal da aplicação EasyConsult
 * 
 * Responsável por inicializar a aplicação e conectar todos os componentes.
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility Principle: Cada componente tem uma única responsabilidade
 * - Open/Closed Principle: A aplicação é extensível sem modificação do código existente
 * - Liskov Substitution Principle: Os componentes podem ser substituídos por implementações alternativas
 * - Interface Segregation Principle: Interfaces específicas para diferentes funcionalidades
 * - Dependency Inversion Principle: Dependências são injetadas nos componentes
 */

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacao();
});

/**
 * Inicializa a aplicação
 */
function inicializarAplicacao() {
    // Inicializa os controladores
    const pacienteController = new PacienteController();
    const profissionalController = new ProfissionalController();
    const consultaController = new ConsultaController(pacienteController, profissionalController);
    
    // Inicializa os componentes da interface
    inicializarTabs();
    inicializarNavegacao();
    
    // Exibe mensagem de inicialização no console
    console.log(`${config.get('appName')} v${config.get('version')} inicializado com sucesso!`);
    
    // Adiciona dados de exemplo se for a primeira execução
    if (config.get('debugMode')) {
        adicionarDadosExemplo(pacienteController, profissionalController, consultaController);
    }
}

/**
 * Inicializa o sistema de abas
 */
function inicializarTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas
            document.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
            });
            
            // Adiciona a classe 'active' à aba clicada
            tab.classList.add('active');
            
            // Obtém o ID da aba
            const tabId = tab.dataset.tab;
            
            // Oculta todos os painéis de conteúdo
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Exibe o painel de conteúdo correspondente
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Inicializa a navegação por âncoras
 */
function inicializarNavegacao() {
    // Obtém todos os links de navegação
    const navLinks = document.querySelectorAll('.nav a');
    
    // Adiciona evento de clique a cada link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove a classe 'active' de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe 'active' ao link clicado
            link.classList.add('active');
            
            // Obtém o ID da seção alvo
            const targetId = link.getAttribute('href').substring(1);
            
            // Rola a página até a seção
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Função para rolar até uma seção específica
    window.scrollToSection = (sectionId) => {
        // Atualiza o link ativo
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${sectionId}`);
        });
        
        // Rola a página até a seção
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
}

/**
 * Adiciona dados de exemplo para demonstração
 * @param {PacienteController} pacienteController - Controlador de pacientes
 * @param {ProfissionalController} profissionalController - Controlador de profissionais
 * @param {ConsultaController} consultaController - Controlador de consultas
 */
function adicionarDadosExemplo(pacienteController, profissionalController, consultaController) {
    // Verifica se já existem dados
    const pacientes = new StorageService('pacientes').getAll();
    const profissionais = new StorageService('profissionais').getAll();
    
    if (pacientes.length > 0 || profissionais.length > 0) {
        return; // Já existem dados, não adiciona exemplos
    }
    
    // Adiciona pacientes de exemplo
    const pacientesExemplo = [
        { nome: 'Maria Silva', email: 'maria@exemplo.com', telefone: '(11) 98765-4321', dataNascimento: '1985-05-15' },
        { nome: 'João Santos', email: 'joao@exemplo.com', telefone: '(11) 91234-5678', dataNascimento: '1990-10-20' },
        { nome: 'Ana Oliveira', email: 'ana@exemplo.com', telefone: '(11) 99876-5432', dataNascimento: '1978-03-25' }
    ];
    
    // Adiciona profissionais de exemplo
    const profissionaisExemplo = [
        { nome: 'Dr. Carlos Mendes', especialidade: 'Clínico Geral', crm: '12345', email: 'carlos@exemplo.com' },
        { nome: 'Dra. Fernanda Lima', especialidade: 'Cardiologista', crm: '23456', email: 'fernanda@exemplo.com' },
        { nome: 'Dr. Ricardo Souza', especialidade: 'Dermatologista', crm: '34567', email: 'ricardo@exemplo.com' }
    ];
    
    // Salva os exemplos
    pacientesExemplo.forEach(p => {
        const paciente = EntityFactory.create('paciente', p);
        new StorageService('pacientes').save(paciente.toJSON());
    });
    
    profissionaisExemplo.forEach(p => {
        const profissional = EntityFactory.create('profissional', p);
        new StorageService('profissionais').save(profissional.toJSON());
    });
    
    // Recarrega os dados
    eventEmitter.emit('paciente:created');
    eventEmitter.emit('profissional:created');
    
    console.log('Dados de exemplo adicionados com sucesso!');
}

