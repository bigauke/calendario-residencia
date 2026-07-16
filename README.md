<div align="center">

<br>

# 🚀 Residência TIC 44 — CTE-IA

**Calendário interativo do programa de Capacitação Técnica e Empreendedora em Inteligência Artificial**

[![SOFTEX](https://img.shields.io/badge/SOFTEX-2026%2F2027-0891b2?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==)](https://softex.br/)
[![SiDi](https://img.shields.io/badge/SiDi-Instituto-22d3ee?style=flat-square)](https://sidi.org.br/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](.)

<br>

> Desenvolvido por **Daniel Linhares**, Residente em IA · SOFTEX / SiDi · Turma 2026–2027

<br>

</div>

---

## ✨ Sobre o Projeto

O **Calendário da Residência TIC 44** é uma aplicação web de página única (*SPA*) construída com **Vanilla JavaScript + Vite**, sem frameworks externos. Ela serve como painel pessoal para acompanhar o cronograma de aulas, materiais e progresso do programa **CTE-IA** — Capacitação Técnica e Empreendedora em Inteligência Artificial, promovido pela **SOFTEX** em parceria com o **SiDi**.

A aplicação é compilada como um único arquivo HTML autocontido (`dist/index.html`), facilitando o compartilhamento e a hospedagem sem infraestrutura adicional.

---

## 🖥️ Funcionalidades

| Feature | Descrição |
|---|---|
| ⏱️ **Countdown em tempo real** | Contagem regressiva até a próxima aula, atualizada segundo a segundo |
| 📊 **Anel de progresso** | Visualização circular animada da porcentagem de aulas concluídas |
| 📅 **Calendário interativo** | Navegação mensal com hover tooltip e click para ver detalhes de cada aula |
| 🗓️ **Feriados nacionais** | Marcação automática de feriados fixos e móveis (2026–2027), incluindo regionais |
| 🕐 **Timeline cronológica** | Linha do tempo agrupada por mês com status (concluída / hoje / futura) |
| 📋 **Lista de aulas** | Listagem completa com filtros por categoria e acesso direto ao material |
| 💬 **Sistema de feedback** | Modal flutuante com avaliação por estrelas, integrado ao Formspree |
| 🔝 **Scroll to top** | Botão de retorno ao topo com animação suave |
| 📱 **Responsivo** | Layout adaptado para mobile, tablet e desktop |
| 🎞️ **Animações** | Fade-up com IntersectionObserver e transições CSS fluidas |

---

## 🗂️ Estrutura do Projeto

```
calendar/
├── src/
│   ├── components/         # Componentes de UI
│   │   ├── calendar.js     # Calendário mensal interativo
│   │   ├── classList.js    # Lista completa de aulas com filtros
│   │   ├── feedback.js     # Modal de feedback (FAB + formulário + estrelas)
│   │   ├── footer.js       # Rodapé da aplicação
│   │   ├── hero.js         # Hero section (countdown + progresso + categorias)
│   │   ├── navbar.js       # Barra de navegação com âncoras
│   │   ├── scrollTop.js    # Botão flutuante de volta ao topo
│   │   └── timeline.js     # Timeline cronológica com animação escalonada
│   ├── data/
│   │   └── aulas.js        # Dados das aulas + definição de CATEGORIES
│   ├── styles/
│   │   └── index.css       # Design system completo (tokens, componentes, layouts)
│   └── main.js             # Entry point — monta os componentes e inicializa observers
├── data/
│   ├── Aulas.csv           # Planilha fonte das aulas (workload, datas, URLs)
│   └── Aulas_oficial.csv   # Versão oficial do cronograma
├── index.html              # Shell HTML com meta tags, GA4 e fontes
├── vite.config.js          # Configuração Vite com vite-plugin-singlefile (IIFE)
├── merge-urls.cjs          # Script utilitário para mesclar URLs de materiais
├── fix-workload.js         # Script utilitário para ajuste de carga horária
├── update-workload.js      # Script utilitário para atualização em lote do workload
├── postbuild.cjs           # Script pós-build (ex: cópia de assets)
└── package.json
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Instalação

```bash
# Clone o repositório
git clone https://github.com/bigauke/calendario-residencia.git
cd calendario-residencia

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador. O servidor de desenvolvimento suporta HMR (Hot Module Replacement).

### Build de Produção

```bash
npm run build
```

O artefato final será gerado em `dist/index.html` — um arquivo HTML **completamente autocontido** com CSS e JS embutidos (via `vite-plugin-singlefile`). Pode ser aberto diretamente no navegador ou hospedado em qualquer servidor estático.

### Preview do Build

```bash
npm run preview
```

---

## 🧱 Arquitetura

A aplicação adota uma arquitetura **modular baseada em componentes puros**, sem Virtual DOM ou reatividade de framework:

```
main.js
  └── mount()
        ├── createNavbar()      → <nav>
        ├── createHero()        → <section#hero>
        │     ├── Countdown (setInterval 1s)
        │     ├── Progress Ring (SVG animado)
        │     └── Category Pills
        ├── createCalendar()    → <section#calendar>
        │     ├── renderCalendar() (re-renderiza ao navegar)
        │     ├── Tooltip (DOM dinâmico no hover)
        │     └── showDetail() (click no dia)
        ├── createTimeline()    → <section#timeline>
        │     └── IntersectionObserver (staggered reveal)
        ├── createClassList()   → <section#classes>
        ├── createFooter()      → <footer>
        ├── createFeedback()    → FAB + Modal (Formspree)
        └── createScrollTop()   → botão flutuante
```

Cada componente é uma **função pura** que retorna um `HTMLElement`, montado no DOM uma única vez via `appendChild`. O estado é gerenciado localmente em closures, sem store global.

A função `expandAulas()` em `utils.js` expande automaticamente o cronograma de aulas baseando-se na carga horária (`workload`), distribuindo dias úteis e pulando feriados e fins de semana.

---

## 📦 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Vite](https://vite.dev/) | `^8.1.4` | Bundler e dev server |
| [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | `^2.3.3` | Empacota tudo em um único HTML |
| [Google Fonts](https://fonts.google.com/) | — | Inter + Space Grotesk |
| [Google Analytics 4](https://analytics.google.com/) | — | Rastreamento de acessos |
| [Formspree](https://formspree.io/) | — | Backend do formulário de feedback |

Sem dependências de runtime. Zero frameworks. Zero bibliotecas JS no cliente.

---

## 📐 Design System

O CSS é estruturado em camadas lógicas dentro de `src/styles/index.css`:

1. **Tokens** — variáveis CSS para cores, tipografia, espaçamentos e bordas
2. **Reset & Base** — normalização e tipografia base (Inter, Space Grotesk)
3. **Componentes** — estilos isolados por componente (`.hero-*`, `.calendar-*`, etc.)
4. **Utilitários** — classes de animação (`.fade-up`, `.visible`) e helpers
5. **Responsividade** — media queries mobile-first

Paleta de cores baseada em tons de `cyan` (`#0891b2` → `#22d3ee`) sobre fundo escuro (`#000` → `#0a0a0a`), com acentuação em `emerald` e `violet` por categoria de aula.

---

## 📋 Categorias de Aulas

| Categoria | Emoji | Cor |
|---|---|---|
| Fundamentos de IA | 🧠 | Cyan |
| Machine Learning | 📈 | Emerald |
| Deep Learning | 🔬 | Violet |
| Empreendedorismo | 💼 | Amber |
| Projetos Práticos | 🛠️ | Orange |

---

## 🤝 Contribuindo

Este é um projeto pessoal desenvolvido no contexto da **Residência em TIC 44**. Sugestões são bem-vindas através do sistema de **feedback integrado** na própria aplicação (botão 💬 no canto inferior direito).

---

## 👤 Autor

**Daniel Linhares**  
Residente em IA — Turma TIC 44  
SOFTEX / SiDi · 2026–2027

---

<div align="center">

Feito com ☕ e muito JavaScript puro durante a Residência em IA.

</div>
