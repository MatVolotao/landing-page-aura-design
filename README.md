# Studio Aura — landing page conceitual

Refatoração do exercício de landing page do Studio Aura, baseada no material fornecido durante a imersão. O objetivo foi preservar a atmosfera de luxo discreto, melhorar a apresentação dos projetos e organizar a implementação para manutenção e futura publicação no GitHub Pages.

## Como executar

1. Abra `index.html` no navegador. Não há instalação de dependências nem etapa de compilação.
2. Para desenvolvimento, prefira abrir a pasta num editor e usar uma extensão como **Live Server** (ou `python -m http.server 8000` no terminal e `http://localhost:8000`).
3. Os vídeos e imagens estão em `assets/`. As fontes são carregadas do Google Fonts e as animações da seção de processo usam GSAP/ScrollTrigger via CDN. Sem GSAP ou com movimento reduzido, a seção apresenta cartões estáticos.

## Organização

```text
aura-design/
├── index.html          # Semântica, conteúdo e estrutura da página
├── css/
│   └── styles.css      # Design system, componentes e responsividade
├── js/
│   └── main.js         # Navegação, revelações, formulário e animações
├── assets/             # Fotos/vídeos da aula e retrato conceitual gerado
├── email-marina.txt    # Briefing e prompt da aula: referência histórica
└── README.md
```

## Decisões desta versão

- **HTML, CSS e JavaScript nativos:** são suficientes para esta landing page. React e TypeScript não trariam benefício claro nesta etapa.
- **Portfólio editorial:** a grade assimétrica apresenta os seis projetos. Clique ou pressione Enter sobre uma foto para ampliá-la e ver a legenda. Use as setas para navegar e Esc para fechar.
- **História de marca completa:** o conteúdo da página é uma narrativa publicitária **fictícia** para o exercício. Evitamos números de registro, premiações e contatos particulares sem origem. Os depoimentos são exemplos narrativos, não relatos verificados.
- **Retrato conceitual:** gerado por IA para representar a personagem fictícia Marina Vasconcelos; não é uma fotografia da suposta cliente. Imagem em `assets/marina-retrato-conceitual.png`.
- **Contato e rodapé:** WhatsApp, e-mail e ateliê aparecem como canais ilustrativos. O rodapé mantém quatro colunas, ícones sociais ilustrativos e atalhos para a seção de contato.
- **Formulário de demonstração:** o botão “Testar formulário” valida os campos com dados de exemplo. O formulário não transmite nem armazena informações.
- **Skills globais:** nenhuma pasta `.agents/` ou `.claude/` é necessária no projeto publicado.

## Antes de publicar para uma cliente real

- Confirmar autorização de uso das imagens e vídeos fornecidos na aula.
- Trocar os depoimentos de exemplo por depoimentos reais autorizados.
- Receber foto e biografia verificadas da fundadora, dados do escritório e links das redes sociais.
- Configurar e testar um endpoint de formulário (por exemplo, um serviço de formulários com proteção antispam e política de privacidade), WhatsApp e redes sociais reais. **Sem esses dados não há como oferecer contato efetivamente funcional em uma página estática.**
- Testar performance de vídeos em conexões móveis e adaptar o conteúdo após aprovação da cliente.

> **Aviso:** este é um projeto fictício para estudo. Não deve ser apresentado como site oficial de um studio real. O arquivo `email-marina.txt` inclui tanto o e-mail fictício quanto o prompt utilizado na aula; ambos são material de contexto, não especificações técnicas mandatórias.
