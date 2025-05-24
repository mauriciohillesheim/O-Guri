# 🛒 O Guri - Guia de Personalização e Publicação

Este documento contém instruções detalhadas para personalizar e publicar o site do serviço "🛒 O Guri", seu comprador pessoal de mercado.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Personalização de Produtos](#personalização-de-produtos)
4. [Personalização Visual](#personalização-visual)
5. [Configuração de Taxas de Serviço](#configuração-de-taxas-de-serviço)
6. [Publicação no GitHub](#publicação-no-github)
7. [Hospedagem](#hospedagem)
8. [Suporte](#suporte)

## 🔍 Visão Geral

O site "O Guri" é uma aplicação 100% frontend desenvolvida com HTML, CSS e JavaScript puro. Todos os dados são armazenados localmente no navegador do usuário usando LocalStorage, o que significa que não há necessidade de backend ou banco de dados para o funcionamento básico.

### Funcionalidades Principais:

- Cadastro e login de usuários
- Catálogo de produtos personalizável
- Carrinho de compras interativo
- Cálculo automático de taxa de serviço
- Checkout com múltiplos métodos de pagamento
- Painel administrativo para gerenciar produtos, pedidos e usuários
- Interface responsiva para desktop e dispositivos móveis
- Animações e efeitos visuais interativos

## 📁 Estrutura de Arquivos

```
o-guri-js/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos da aplicação
├── js/
│   └── main.js         # Lógica da aplicação
└── images/             # Imagens e placeholders
    ├── product-placeholder.svg
    ├── hero-placeholder.svg
    ├── avatar-placeholder.svg
    └── pix-placeholder.svg
```

## 🛍️ Personalização de Produtos

### Adicionando Novos Produtos

Você pode adicionar novos produtos de duas maneiras:

1. **Através do Painel Administrativo (recomendado):**
   - Acesse o site e clique no botão de engrenagem no canto inferior direito
   - Na aba "Produtos", clique em "Adicionar Produto"
   - Preencha os detalhes do produto e salve

2. **Editando o Código:**
   - Abra o arquivo `js/main.js`
   - Localize a função `initSampleProducts()`
   - Adicione novos produtos ao array seguindo o formato existente:

```javascript
{
    id: '7',  // Use um ID único
    name: 'Nome do Produto',
    description: 'Descrição do produto',
    price: 10.90,  // Preço em reais
    imageUrl: 'images/seu-produto.jpg',  // Caminho para a imagem
    category: 'fruits',  // Categoria (fruits, vegetables, meat, dairy, bakery, other)
    stock: 50,  // Quantidade em estoque
    badge: 'Novo'  // Opcional: badge de destaque
}
```

### Adicionando Imagens de Produtos

1. Adicione suas imagens de produtos na pasta `images/`
2. Recomendamos usar imagens com proporção 1:1 (quadradas) e tamanho de 300x300 pixels
3. Formatos recomendados: JPG ou PNG
4. Ao adicionar produtos, use o caminho relativo: `images/nome-da-imagem.jpg`

### Personalizando Categorias

Para modificar as categorias de produtos:

1. Edite o arquivo `index.html`
2. Localize a seção com a classe `product-categories`
3. Modifique os botões de categoria conforme necessário
4. Atualize também as opções no formulário de produto no painel administrativo

## 🎨 Personalização Visual

### Alterando Cores

O site usa um sistema de variáveis CSS que facilita a personalização de cores:

1. Abra o arquivo `css/styles.css`
2. Localize a seção `:root` no início do arquivo
3. Modifique as variáveis de cor conforme desejado:

```css
:root {
    --primary-color: #ff6b35;     /* Cor principal */
    --primary-hover: #ff8c5a;     /* Cor principal (hover) */
    --secondary-color: #2ec4b6;   /* Cor secundária */
    --secondary-hover: #3ad8c9;   /* Cor secundária (hover) */
    --text-color: #333333;        /* Cor do texto */
    --text-light: #666666;        /* Cor do texto claro */
    /* ... outras variáveis ... */
}
```

### Alterando Fontes

1. Modifique a variável `--font-family` na seção `:root` do arquivo CSS
2. Se quiser usar uma fonte personalizada, adicione o link da fonte no `<head>` do arquivo `index.html`

### Personalizando o Logo e Hero

1. Substitua o texto "🛒 O Guri" no arquivo `index.html` pelo seu logo
2. Para adicionar um logo como imagem, modifique a seção `.logo` no HTML
3. Substitua a imagem hero em `images/hero-placeholder.svg` pela sua própria imagem

## ⚙️ Configuração de Taxas de Serviço

O cálculo da taxa de serviço está implementado na função `calculateServiceFee()` no arquivo `js/main.js`:

```javascript
function calculateServiceFee(subtotal) {
    if (subtotal <= 100) {
        return 30;
    } else if (subtotal <= 200) {
        return 40;
    } else if (subtotal <= 300) {
        return 50;
    } else if (subtotal <= 400) {
        return 60;
    } else if (subtotal <= 500) {
        return 70;
    } else {
        // Para cada 100 reais adicionais, adiciona 10 reais na taxa
        const additional = Math.floor((subtotal - 500) / 100) * 10;
        return 70 + additional;
    }
}
```

Você pode modificar estes valores conforme necessário para ajustar sua política de taxas.

## 📤 Publicação no GitHub

Para publicar o projeto no seu repositório GitHub:

1. Crie um novo repositório no GitHub
2. Clone o repositório para sua máquina local:
   ```
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
3. Copie todos os arquivos do projeto para a pasta do repositório
4. Adicione, faça commit e push dos arquivos:
   ```
   git add .
   git commit -m "Primeira versão do O Guri"
   git push origin main
   ```

## 🌐 Hospedagem

Você pode hospedar este site em qualquer serviço que suporte páginas estáticas:

### GitHub Pages (Gratuito)

1. No seu repositório GitHub, vá para Settings > Pages
2. Selecione a branch main como source
3. Clique em Save
4. Seu site estará disponível em `https://seu-usuario.github.io/seu-repositorio/`

### Netlify (Gratuito)

1. Crie uma conta em [netlify.com](https://www.netlify.com/)
2. Clique em "New site from Git"
3. Selecione GitHub e o repositório do projeto
4. Clique em "Deploy site"

### Vercel (Gratuito)

1. Crie uma conta em [vercel.com](https://vercel.com/)
2. Importe seu repositório GitHub
3. Configure as opções de deploy (geralmente as configurações padrão funcionam bem)
4. Clique em "Deploy"

## 🔧 Suporte

Este projeto é 100% frontend e usa LocalStorage para armazenar dados. Isso significa que:

- Os dados são armazenados apenas no navegador do usuário
- Se o usuário limpar o cache ou usar outro navegador/dispositivo, os dados não estarão disponíveis
- Para uma solução mais robusta, considere adicionar um backend com banco de dados

Para qualquer dúvida ou suporte adicional, entre em contato através do GitHub.

---

Desenvolvido com ❤️ para o serviço "🛒 O Guri"
