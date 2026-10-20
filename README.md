# Pedro Henrique: Cyber Defender

Portfólio pessoal de Segurança Cibernética com estética de plataforma de streaming. HTML, CSS e JavaScript puros, pronto para o GitHub Pages.

## Estrutura

```
index.html            página única
favicon.svg
assets/css/style.css  estilos
assets/js/data.js     TODO o conteúdo (projetos, certificados, habilidades, contato)
assets/js/i18n.js     textos da interface em português e inglês
assets/js/main.js     intro, perfis, carrosséis, modal e animações
```

## Editar o conteúdo

Tudo fica em `assets/js/data.js`:

- `CONTACT`: troque `github` e `email` pelos seus dados reais.
- `CATALOG.projects` / `certs` / `soon`: cada objeto vira um card e um modal. Coloque o link do repositório em `links` com `primary: true` para o botão ▶ aparecer.
- `CATALOG.skills`: `level` controla a barra de progresso.
- `PROFILES`: textos e seção de destino de cada perfil de "Quem está assistindo?".

## Idiomas (PT / EN)

O botão PT | EN no topo troca o site inteiro e a escolha fica salva no navegador. Na primeira visita, o idioma segue o do navegador. Para mandar o link direto em inglês, use `?lang=en` (ex.: `https://SEU-USUARIO.github.io/?lang=en`).

- Textos do conteúdo em `data.js` usam `{ pt: '...', en: '...' }`. Ao adicionar um projeto, escreva as duas versões.
- Textos fixos da interface (menu, botões, títulos) ficam em `i18n.js`.

A intro e a escolha de perfil ficam salvas no `sessionStorage`, então só aparecem uma vez por sessão. Para ver de novo, abra uma aba anônima.

## Rodar localmente

```
python -m http.server 8000
```

Depois abra http://localhost:8000.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo `SEU-USUARIO.github.io` para ficar na raiz do domínio).
2. Envie estes arquivos para a branch `main`.
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
