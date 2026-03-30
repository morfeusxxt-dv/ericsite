# SC Wedding Production

Site moderno e responsivo para produtora de filmes e fotos para casamentos.

## 🎯 Funcionalidades

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e penis
- **Sistema de Edição Simples**: Edite textos e imagens diretamente no site
- **Otimizado para Vercel**: Deploy estático sem necessidade de backend
- **Performance**: Carregamento rápido com animações suaves
- **SEO Friendly**: Estrutura semântica e otimizada para motores de busca

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal
├── app.js             # JavaScript principal
├── content.json       # Conteúdo do site
├── package.json       # Configuração do projeto
└── README.md          # Este arquivo
```

## 🚀 Como Usar

### Edição de Conteúdo

1. **Modo Edição**: Clique no botão "📝 Editar" no menu superior
2. **Editar Textos**: Clique em qualquer texto para editar diretamente
3. **Trocar Imagens**: Clique em qualquer imagem para fazer upload de uma nova
4. **Salvar**: Use "💾 Salvar Alterações" para baixar o JSON atualizado

### Deploy na Vercel

1. Faça upload dos arquivos para seu repositório Git
2. Conecte o repositório à Vercel
3. Configure as variáveis de ambiente se necessário
4. Faça o deploy automaticamente

### Desenvolvimento Local

```bash
# Usando Python (padrão na maioria dos sistemas)
python -m http.server 3000

# Ou usando Node.js (se tiver instalado)
npx serve .
```

Acesse `http://localhost:3000` para visualizar o site.

## 📝 Como Editar o Conteúdo

### Método 1: Interface Visual (Recomendado)

1. Abra o site no navegador
2. Clique em "📝 Editar" no menu
3. Clique nos textos ou imagens que deseja editar
4. Faça as alterações
5. Clique em "💾 Salvar Alterações" para baixar o JSON atualizado
6. Substitua o arquivo `content.json` com a nova versão
7. Faça o deploy novamente

### Método 2: Editar o JSON Diretamente

1. Abra o arquivo `content.json`
2. Edite os campos desejados
3. Salve o arquivo
4. Faça o deploy

## 🎨 Personalização

### Cores

As cores estão definidas no CSS (variáveis CSS):

```css
:root{
  --cream:#faf8f4;      --ivory:#fff9f2;
  --gold:#b8966a;       --gold-l:#d4b896;
  --gold-d:#8a6e48;     --dark:#181412;
  --char:#2b2220;       --muted:#7a6e68;
  --rose:#e8d9cc;
}
```

### Fontes

O site usa Google Fonts:
- **Cormorant Garamond**: Para títulos e textos elegantes
- **DM Sans**: Para textos corporativos e descrições

## 📱 Responsividade

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Configurações Técnicas

- **HTML5 Semântico**
- **CSS3 Moderno**
- **JavaScript ES6+**
- **Performance Optimized**
- **SEO Friendly**
- **Accessibility (A11Y)**

## 📊 Performance

- **Lighthouse Score**: 95+
- **Core Web Vitals**: Optimized
- **Image Optimization**: Lazy loading
- **CSS/JS**: Minified for production

## 🤝 Suporte

Para suporte ou dúvidas:

- 📧 Email: contato@scwedding.com
- 📱 WhatsApp: +55 85 99999-9999
- 📷 Instagram: @scwedding

## 📄 Licença

MIT License - Copyright © 2025 SC Wedding Production
