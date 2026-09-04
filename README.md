# Clarion — Landing (campanha)

Landing page do Clarion (solução Mosten), reconstruída a partir de
`https://mosten.com/clarionads/` com uma seção de **Planos e preços** adicionada
após "Entenda como o Clarion funciona".

## Estrutura

```
index.html
assets/
├── css/   styles.css · modal.css · form.css
├── js/    modal.js · form.js · main.js
└── images/
```

## Rodar localmente

```bash
python -m http.server 4599 --directory .
# abre http://localhost:4599
```

## Notas

- Fonte: Inter Tight (Google Fonts). Identidade: roxo `#612cb5`, fundo `#f3f0fa`,
  CTA verde `#006600`.
- O formulário de demonstração (`assets/js/form.js`) faz `POST` para
  `/wp-json/mosten/lead-forge-clarion` e redireciona para `/clarionads/typ/` —
  endpoints do WordPress da Mosten; funcionam apenas quando hospedado nesse domínio.
- A seção de planos usa o mesmo modal de demonstração no botão "Fale com vendas"
  do plano Enterprise.
