# Website de Reações Químicas

![GitHub Tamanho do Repo](https://img.shields.io/github/repo-size/ifmgrn/ifmgrn.github.io?label=Tamanho%20do%20Repo&style=flat)

Este repositório é um projeto escolar e contém o código-fonte por trás do [Banco de Dados de Reações Quimicas](https://ifmgrn.vercel.app/).

O principal foco do projeto é disponibilizar um banco de dados de moléculas em português (brasileiro), baseado no [PubChem](https://pubchem.ncbi.nlm.nih.gov/).

Além disso, ele se propõe a oferecer uma tabela periódica interativa e uma forma para o usuário catalogar reações químicas usando o formato que desejar.

Esta versão do website funciona totalmente no lado do cliente.

## Guia de Instalação

### Forma automatizada (recomendada caso você esteja num computador escolar)

Você pode baixar e executar este [script](setup_helper.ps1) através deste comando no Powershell:

```powershell
# Defina a localização para a pasta de Downloads
Set-Location (New-Object -ComObject Shell.Application).Namespace('shell:Downloads').Self.Path
# Baixa o script com o nome "reacoes_quimicas.ps1"
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/ifmgrn/ifmgrn.github.io/refs/heads/main/setup_helper.ps1' -OutFile website.ps1
# Roda o script ignorando a política de execução
powershell -ep Bypass .\website.ps1
```

O script fará o seguinte:

- Configurará o Powershell
  - Fará o Powershell priorizar o PATH do usuário sobre o PATH do sistema
  - Isso permitirá com que você utilize aplicativos portáteis e atualizados na linha de comando sem depender do acesso de administrador (para atualizar os que estão no sistema)
- Baixará o [Git](https://git-scm.com/) caso necessário
  - Caso o Git não esteja no PATH ou não esteja atualizado, baixará o Git portátil mais recente
  - Depois de baixá-lo, irá adicionar ele ao PATH do usuário e configurar o user.name e o user.email conforme a entrada do usuário
- Baixará o [Bun](https://bun.com/) caso necessário
  - Caso o Bun não esteja no PATH ou não esteja atualizado, baixará o Bun portátil e adicionará-lo ao PATH do usuário
- Clonará o repositório e baixará suas dependências
- Te dará a opção de baixar a versão portátil do [Visual Studio Code](https://code.visualstudio.com/) (a versão mais atualizada), e adicioná-lo ao PATH do usuário e na sua área de trabalho

### Forma manual

Faça isso no Powershell (assumindo que você tenha Git, Node.js e pnpm instalados):

```powershell
# Clona o repositório
git clone 'https://github.com/ifmgrn/ifmgrn.github.io'
# Baixa as dependências do projeto
bun install --cwd 'ifmgrn.github.io'
# Roda um servidor local de desenvolvimento
bun run --cwd 'ifmgrn.github.io' dev
```

## Documentação

Veja a aba ["Projetos"](https://github.com/users/ifmgrn/projects/1) do GitHub para acompanhar o progresso das tarefas e o "roadmap".

## Contribuidores

[John](https://github.com/ifmgrn), [Davi Almeida](https://github.com/davialmeida02), [Nicolas Samuel](https://github.com/0focomaisansiedade), [Luiz Fernando](https://github.com/soqueroentrar), Atos e Daniel.

## Licença

Esse repositório está sob a licença AGPL v3. Veja o arquivo [LICENSE.txt](LICENSE.txt) para mais detalhes.
