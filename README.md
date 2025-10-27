# BagreType 🐟

**BagreType** é um sistema de aprendizado de máquina desenvolvido para descobrir o layout de teclado mais eficiente para digitação. O projeto utiliza análise de custos de digitação e dados linguísticos para criar layouts otimizados, tanto específicos por idioma quanto universais, visando maximizar velocidade e conforto.

---

## 👥 Autores

**Samuel Marcio Fonseca Santos** (RA: 30599661)  
**João Pedro de Souza Letro** (RA: 25851691)

Estudantes do 8º semestre da Universidade de Franca (UniFran)  
Projeto de Conclusão de Curso

---

## 🎯 Objetivo

O objetivo deste projeto é projetar um sistema de aprendizado de máquina capaz de descobrir o layout de teclado mais eficiente para digitação. Ao analisar custos de digitação e dados linguísticos, pretendemos criar layouts específicos por idioma e universais que maximizem velocidade e conforto.

---

## 📋 Metodologia

### 1. Medição de Custos de Digitação

Desenvolvemos um website que exibe caracteres únicos ou sequências de teclas aleatórias na tela.

- Registramos o tempo de resposta desde o momento em que o caractere/sequência aparece até o participante pressionar a(s) tecla(s) correspondente(s).
- Para sequências multi-tecla, medimos:
  - Tempo até a primeira tecla ser pressionada
  - Tempo entre teclas consecutivas
  - Tempo total da sequência
- Coletamos grandes quantidades de dados repetindo o experimento com participantes proficientes em digitação à cega (touch-typing), recrutados via comunidades online (ex: Discord).
- A partir desses dados, calculamos o custo médio de pressionar cada tecla e combinação de teclas.

### 2. Construção do Modelo de Custo de Digitação

Utilizando os dados coletados, criamos um modelo que estima a dificuldade ou "custo" de digitar qualquer caractere ou sequência de caracteres possível.

### 3. Coleta de Dados Linguísticos

Coletamos grandes corpora de texto em diferentes idiomas para representar frequências de uso reais de caracteres e sequências. Isso garante que o modelo capture tanto demandas universais quanto específicas por idioma.

### 4. Treinamento do Algoritmo de Aprendizado de Máquina

O sistema de ML recebe o modelo de custo de digitação e os dados linguísticos como entrada. O modelo ML cria layouts de teclado que minimizam o custo geral de digitação.

Dois objetivos serão explorados:
- **Teclado Universal**: Um único layout otimizado para múltiplos idiomas
- **Teclado Dinâmico**: Layouts otimizados para qualquer texto ou dataset específico (ex: um "Teclado Lorem Ipsum")

### 5. Testes e Avaliação

Implementamos os novos layouts e conduzimos testes de digitação com participantes humanos (em nosso website ou outros existentes, como monkeytype).

- Comparação de velocidade de digitação, precisão e conforto contra layouts padrão (ex: QWERTY, Dvorak, Colemak)
- Análise de melhorias em eficiência

### 6. Resultados e Publicação

Documentamos os achados, destacando tanto otimizações universais quanto específicas por idioma. Os resultados serão publicados como artigo científico, demonstrando a metodologia, dados e implicações para eficiência de digitação.

---

## 🚀 Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI modernos
- **Supabase** - Backend como serviço
- **GSAP** - Biblioteca de animações
- **React Router** - Roteamento
- **i18next** - Internacionalização
- **Recharts** - Visualização de dados

---

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou bun

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bagre-type-optimizer.git
cd bagre-type-optimizer
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
bun dev
```

5. Acesse a aplicação em `http://localhost:5173`

---

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter ESLint

---

## 📂 Estrutura do Projeto

```
bagre-type-optimizer/
├── public/          # Arquivos estáticos
│   ├── keyboard-images/  # Imagens dos layouts de teclado
│   ├── quotes.txt   # Citações para prática (inglês)
│   └── quotes-pt-BR.txt  # Citações para prática (português)
├── src/
│   ├── components/  # Componentes React
│   ├── contexts/    # Contextos React
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Bibliotecas e utilitários
│   ├── locales/     # Arquivos de tradução
│   ├── pages/       # Páginas da aplicação
│   └── integrations/ # Integrações externas
└── supabase/        # Configuração do Supabase
```

---

## 🌐 Funcionalidades

- ✅ Sistema de autenticação com Supabase
- ✅ Coleta de dados de digitação em tempo real
- ✅ Visualização de progresso com gráficos
- ✅ Suporte multi-idioma (Português e Inglês)
- ✅ Temas claro/escuro
- ✅ Layouts de teclado customizáveis
- ✅ Análise de performance por letra
- ✅ Geração de aulas personalizadas
- ✅ Comparação de layouts

---

## 📊 Status do Projeto

- [x] Desenvolvimento da plataforma web
- [x] Sistema de coleta de dados
- [x] Modelo de custo de digitação (em desenvolvimento)
- [x] Visualização de resultados
- [ ] Algoritmo de otimização de layout
- [ ] Testes com usuários
- [ ] Publicação científica

---

## 📝 Licença

Este projeto é desenvolvido como parte do Trabalho de Conclusão de Curso na Universidade de Franca (UniFran).

---

## 🤝 Contribuindo

Este é um projeto acadêmico para fins de pesquisa. Contribuições e sugestões são bem-vindas!

---

# BagreType 🐟

**BagreType** is a machine learning system designed to discover the most efficient keyboard layout for typing. The project uses typing cost analysis and linguistic data to create optimized layouts, both language-specific and universal, aiming to maximize speed and comfort.

---

## 👥 Authors

**Samuel Marcio Fonseca Santos** (RA: 30599661)  
**João Pedro de Souza Letro** (RA: 25851691)

8th semester students at Universidade de Franca (UniFran)  
Graduation Project

---

## 🎯 Objective

The goal of this project is to design a machine learning system capable of discovering the most efficient keyboard layout for typing. By analyzing typing costs and linguistic data, we aim to create both language-specific and universal layouts that maximize speed and comfort.

---

## 📋 Methodology

### 1. Measure Typing Costs

We developed a website that displays random single characters or key sequences on the screen.

- Record the response time from the moment the character/sequence appears until the participant presses the corresponding key(s).
- For multi-key sequences, measure:
  - Time to first key press
  - Time between consecutive keys
  - Total time for the sequence
- Collect large amounts of data by repeating the experiment with participants who are already proficient at touch-typing, recruited via online communities (e.g., Discord).
- From this data, compute the average cost of pressing each key and key combination.

### 2. Build a Typing Cost Model

Using the collected data, create a model that estimates the difficulty or "cost" of typing any possible character or sequence of characters.

### 3. Collect Linguistic Data

Gather large text corpora across different languages to represent real-world usage frequencies of characters and sequences. This ensures the model captures both universal and language-specific typing demands.

### 4. Train the Machine Learning Algorithm

Input the typing cost model and linguistic data into a machine learning system. The ML model will create keyboard layouts that minimize the overall typing cost.

Two goals will be explored:
- **Universal Keyboard**: A single layout optimized across multiple languages
- **Dynamic Keyboard**: Layouts optimized for any specific text or dataset (e.g., a "Lorem Ipsum Keyboard")

### 5. Testing and Evaluation

Implement the new layouts and conduct typing tests with human participants (in our website or other existing ones, like monkeytype).

- Compare typing speed, accuracy, and comfort against standard layouts (e.g., QWERTY, Dvorak, Colemak)
- Analyze improvements in efficiency

### 6. Results and Publication

Document findings, highlighting both universal and language-specific optimizations. Publish the results as a science article, showcasing the methodology, data, and implications for typing efficiency.

---

## 🚀 Technologies Used

- **Vite** - Build tool and dev server
- **React** - JavaScript library for building interfaces
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **Supabase** - Backend as a service
- **GSAP** - Animation library
- **React Router** - Routing
- **i18next** - Internationalization
- **Recharts** - Data visualization

---

## 📦 Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or bun

### Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/bagre-type-optimizer.git
cd bagre-type-optimizer
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Configure environment variables:
Create a `.env` file in the project root with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

5. Access the application at `http://localhost:5173`

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build application for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint linter

---

## 📂 Project Structure

```
bagre-type-optimizer/
├── public/          # Static files
│   ├── keyboard-images/  # Keyboard layout images
│   ├── quotes.txt   # Quotes for practice (English)
│   └── quotes-pt-BR.txt  # Quotes for practice (Portuguese)
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Libraries and utilities
│   ├── locales/     # Translation files
│   ├── pages/       # Application pages
│   └── integrations/ # External integrations
└── supabase/        # Supabase configuration
```

---

## 🌐 Features

- ✅ Supabase authentication system
- ✅ Real-time typing data collection
- ✅ Progress visualization with charts
- ✅ Multi-language support (Portuguese and English)
- ✅ Light/dark themes
- ✅ Customizable keyboard layouts
- ✅ Letter-by-letter performance analysis
- ✅ Personalized lesson generation
- ✅ Layout comparison

---

## 📊 Project Status

- [x] Web platform development
- [x] Data collection system
- [x] Typing cost model (in development)
- [x] Results visualization
- [ ] Layout optimization algorithm
- [ ] User testing
- [ ] Scientific publication

---

## 📝 License

This project is developed as part of the Graduation Thesis at Universidade de Franca (UniFran).

---

## 🤝 Contributing

This is an academic project for research purposes. Contributions and suggestions are welcome!
