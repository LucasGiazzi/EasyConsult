# EasyConsult - Sistema de Agendamento de Consultas

Um sistema web frontend para agendamento de consultas entre pacientes e profissionais da saúde, desenvolvido com HTML, CSS e JavaScript puro, utilizando princípios SOLID, Clean Code e padrões de projeto GoF.

## Visão Geral

O EasyConsult é um projeto acadêmico que demonstra a aplicação de boas práticas de desenvolvimento web, arquitetura de software e padrões de projeto. O sistema permite:

- Cadastro de pacientes
- Cadastro de profissionais de saúde
- Agendamento de consultas
- Listagem e filtragem de consultas agendadas

## Estrutura do Projeto

```
EasyConsult/
├── assets/                 # Recursos estáticos (imagens, ícones)
│   └── hero-image.svg      # Imagem da seção inicial
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   ├── app.js              # Inicialização da aplicação
│   ├── config.js           # Configurações (Singleton)
│   ├── controllers/        # Controladores
│   │   ├── paciente-controller.js
│   │   ├── profissional-controller.js
│   │   └── consulta-controller.js
│   ├── models/             # Modelos de dados
│   │   ├── factory.js      # Factory Method
│   │   ├── paciente.js
│   │   ├── profissional.js
│   │   └── consulta.js
│   └── services/           # Serviços
│       ├── observer.js     # Observer
│       └── storage-service.js
└── index.html              # Página principal
```

## Arquitetura

O projeto segue uma arquitetura MVC (Model-View-Controller) simplificada:

- **Model**: Classes que representam as entidades do sistema (Paciente, Profissional, Consulta)
- **View**: HTML e CSS que compõem a interface do usuário
- **Controller**: Classes que gerenciam as operações e a lógica de negócio

## Padrões de Projeto GoF Implementados

### 1. Singleton (Criacional)

Implementado na classe `Config` para garantir uma única instância de configuração em toda a aplicação.

**Arquivo**: `js/config.js`

**Benefícios**:
- Garante acesso global a uma única instância
- Centraliza as configurações do sistema
- Evita duplicação de recursos

**Implementação**:
```javascript
class Config {
    constructor() {
        // Verifica se já existe uma instância
        if (Config.instance) {
            return Config.instance;
        }
        
        // Configurações do sistema
        this._config = {
            // Configurações...
        };
        
        // Armazena a instância para garantir o Singleton
        Config.instance = this;
    }
    
    // Métodos...
}

// Exporta uma instância única do Config
const config = new Config();
```

### 2. Factory Method (Criacional)

Implementado na classe `EntityFactory` para criar diferentes tipos de objetos do domínio (Paciente, Profissional, Consulta).

**Arquivo**: `js/models/factory.js`

**Benefícios**:
- Encapsula a lógica de criação de objetos
- Facilita a manutenção e extensão
- Centraliza a criação de objetos complexos

**Implementação**:
```javascript
class EntityFactory {
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
    
    // Métodos específicos de criação...
}
```

### 3. Observer (Comportamental)

Implementado na classe `EventEmitter` para notificar componentes sobre eventos do sistema, como criação, atualização ou exclusão de entidades.

**Arquivo**: `js/services/observer.js`

**Benefícios**:
- Desacopla os componentes que geram eventos dos que reagem a eles
- Permite adicionar novos observadores sem modificar o código existente
- Facilita a comunicação entre componentes

**Implementação**:
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        this.events[event].push(callback);
        
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback(data);
            });
        }
    }
    
    // Outros métodos...
}
```

## Princípios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)

Cada classe tem uma única responsabilidade:
- `Paciente`: Representar um paciente
- `Profissional`: Representar um profissional de saúde
- `Consulta`: Representar uma consulta
- `PacienteController`: Gerenciar operações de pacientes
- `ProfissionalController`: Gerenciar operações de profissionais
- `ConsultaController`: Gerenciar operações de consultas
- `StorageService`: Gerenciar o armazenamento de dados
- `EventEmitter`: Gerenciar eventos do sistema

### 2. Open/Closed Principle (OCP)

As classes são abertas para extensão, mas fechadas para modificação:
- `EntityFactory`: Pode ser estendido para criar novos tipos de entidades sem modificar o código existente
- `EventEmitter`: Permite adicionar novos tipos de eventos sem modificar a implementação

### 3. Liskov Substitution Principle (LSP)

As classes derivadas podem substituir suas classes base sem afetar o comportamento do programa:
- Os modelos de dados (Paciente, Profissional, Consulta) seguem interfaces consistentes com métodos como `toJSON()` e `fromJSON()`

### 4. Interface Segregation Principle (ISP)

As interfaces são específicas para os clientes que as utilizam:
- Cada controlador expõe apenas os métodos necessários para suas operações específicas
- O `EventEmitter` fornece métodos específicos para inscrição e emissão de eventos

### 5. Dependency Inversion Principle (DIP)

Os módulos de alto nível não dependem de módulos de baixo nível, ambos dependem de abstrações:
- Os controladores dependem de abstrações (serviços) e não de implementações concretas
- O `StorageService` fornece uma abstração para o armazenamento de dados, independente da implementação (localStorage)

## Clean Code

O projeto segue as práticas de Clean Code:

1. **Nomes significativos**: Variáveis, funções e classes têm nomes que descrevem claramente seu propósito
2. **Funções pequenas e focadas**: Cada função realiza uma única tarefa
3. **Comentários explicativos**: Comentários que explicam o "porquê" e não o "como"
4. **Formatação consistente**: Indentação, espaçamento e estilo consistentes
5. **Tratamento de erros**: Validações e tratamento de erros adequados
6. **Evita duplicação de código**: Reutilização de código através de funções e classes
7. **Organização lógica**: Arquivos e diretórios organizados de forma lógica

## Como Executar

1. Clone o repositório ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador web moderno
3. O sistema será carregado e estará pronto para uso

Não são necessárias dependências externas ou configurações adicionais, pois o projeto utiliza apenas HTML, CSS e JavaScript puro.

## Armazenamento de Dados

O sistema utiliza o `localStorage` do navegador para persistir os dados:
- `easyConsult_pacientes`: Armazena os dados dos pacientes
- `easyConsult_profissionais`: Armazena os dados dos profissionais
- `easyConsult_consultas`: Armazena os dados das consultas

Os dados são mantidos mesmo após o fechamento do navegador, mas são específicos para cada navegador e dispositivo.

## Considerações Acadêmicas

Este projeto foi desenvolvido com foco acadêmico para demonstrar a aplicação de:
- Princípios SOLID
- Padrões de Projeto GoF
- Clean Code
- Arquitetura MVC
- Desenvolvimento web frontend

É importante notar que, em um ambiente de produção real, seriam necessárias considerações adicionais como:
- Backend para persistência de dados
- Autenticação e autorização
- Testes automatizados
- Otimizações de performance
- Acessibilidade
- Compatibilidade cross-browser

## Autor

Desenvolvido como projeto acadêmico para demonstração de boas práticas de desenvolvimento de software.

