# SeoScope — Development Instructions

## Projeto

SeoScope é uma ferramenta de análise de SEO técnico.

O usuário informa uma URL e a aplicação analisa o HTML da página,
calcula um SEO Score de 0 a 100 e apresenta problemas e recomendações.

## Stack

Backend:
- Node.js
- TypeScript
- Express
- Cheerio
- Zod

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

## Desenvolvimento

- Priorizar código simples e legível.
- Evitar overengineering.
- Utilizar TypeScript corretamente e evitar `any` quando possível.
- Separar responsabilidades.
- Não adicionar dependências sem necessidade.
- Não implementar funcionalidades fora do escopo solicitado.
- Não avançar para a próxima etapa sem autorização.
- Explicar decisões importantes de arquitetura.

## Git

O projeto utiliza Git e GitHub.

Ao concluir uma etapa:

1. Pare antes da próxima funcionalidade.
2. Informe quais arquivos foram alterados.
3. Resuma as alterações.
4. Sugira um commit usando Conventional Commits.
5. Não execute commit ou push sem autorização.

Padrão:

- feat: nova funcionalidade
- fix: correção
- refactor: refatoração
- chore: configuração
- docs: documentação
- test: testes

Exemplo:

git commit -m "feat: add title analyzer"

Nunca executar sem autorização:

- git commit
- git push
- git merge
- git rebase
- git reset

Nunca adicionar ao Git:

- .env
- tokens
- senhas
- chaves de API
- credenciais

## Fluxo

Implementar
→ Testar
→ Revisar
→ Verificar Git
→ Sugerir commit
→ Aguardar autorização
→ Próxima etapa