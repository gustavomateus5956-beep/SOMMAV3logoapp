# Integração do catálogo SOMMA+

Base auditada: commit `ff81425`. O catálogo oficial contém 1.324 registros e 1.324 IDs únicos. Os seis JSONs fornecidos foram copiados integralmente para `src/data/somma/`; `checksums.json` registra SHA-256 dos originais e `.gitattributes` impede conversão automática de finais de linha.

## Fluxo

`ExerciseLibraryModal` → `searchCatalogExercises` → `SommaDatasetProvider` → catálogo local carregado sob demanda.

- Busca por nome PT-BR, `originalName`, aliases, ID e termos de busca, sem distinção de maiúsculas/acentos.
- Paginação de 20 itens na UI, mantendo ordem e variantes com nomes repetidos. O rodapé mostra carregados e total filtrado.
- Filtros visíveis usam chaves e rótulos oficiais de região corporal e equipamento. O provider também aceita músculo alvo, categoria da biblioteca, atividade, ambiente e coleção.
- Nomes, categorias e instruções do SOMMA passam pelo adapter sem retradução ou recategorização. O índice de busca, relatório, resumo e manifesto são preservados como arquivos auxiliares; não entram no bundle inicial. A busca usa os próprios campos do catálogo, evitando carregar uma segunda cópia dos dados.
- Cada inclusão em uma rotina ganha ID de instância próprio e `catalogRef: { provider: 'somma', id: ID_ORIGINAL }`, além de `source: 'somma'`, `originalName`, instruções e `sets: []`. Não há prescrição automática nem migração dos treinos existentes.

## Fallback e compatibilidade

ExerciseDB entra quando o carregamento/validação do catálogo local falha. Uma busca SOMMA vazia não aciona a rede. A paginação externa permanece externa até uma nova busca, evitando mistura de cursores. Cancelamentos não acionam fallback; resultados de buscas antigas não substituem os filtros atuais.

`getCatalogExerciseById(id, provider)` explicita a origem. Para referências antigas, usar `provider: 'exercisedb'`; IDs numéricos coincidentes não são tratados como equivalentes. `getExternalExerciseById` permanece disponível para os consumidores existentes.

`exerciseDbProvider.ts`, biblioteca legada de 31 exercícios, `exerciseMediaMap.ts`, `WorkoutContext`, repositories e `storageService` não foram alterados. O layout da biblioteca foi mantido, com os filtros alimentados pela taxonomia e um estado de erro.

## Mídia e qualidade dos dados

O manifesto descreve `/exercises/images/` e `/exercises/gifs/`, mas os arquivos de imagem/GIF não foram fornecidos. Os registros SOMMA usam o placeholder existente. A resolução de mídia ignora correspondências aproximadas por nome para esses registros; a mídia legada continua funcionando. Nenhum caminho do manifesto é publicado como se o arquivo já existisse.

Os dados de origem marcam 1.324 instruções para revisão de tradução e 71 classificações para revisão. Essas marcações e textos foram preservados; esta integração valida estrutura e comportamento, não aprova o conteúdo editorial. Há 1.311 nomes PT-BR distintos, sem exclusão das variantes.

O modal de detalhes já incluía gráficos/histórico de demonstração quando não havia sessões reais; esse comportamento preexistente não foi modificado nesta integração.

## Validação

```sh
npm install
npm run lint
npm run test:catalog
npm run build
```

11 testes cobrem integridade dos seis arquivos, contagem/IDs, manifesto e taxonomia, todos os nomes e aliases, paginação integral, filtros combinados, conversão para treino, compatibilidade legada, ausência de fallback em busca vazia, fallback simulado, recuperação, cancelamento e rejeição de dados incompletos.

No ambiente desta entrega: TypeScript 7.0.2 e build Vite 8.3.1 passaram. Dependências foram instaladas com pnpm porque npm não estava disponível. O runner tsx exigiu um ajuste temporário externo ao projeto para a consulta de usuário do Windows, indisponível no sandbox; os 11 testes passaram. Não foi necessário alterar as versões do projeto.

O build mantém avisos de tamanho dos chunks e de `__dirname` na configuração Vite existente. O catálogo é separado e carregado sob demanda (~4,97 MB minificado / 484 KB gzip). Não houve validação ao vivo da disponibilidade do serviço ExerciseDB; o comportamento de fallback foi testado por simulação.

Verificação no navegador local: biblioteca abre, mostra 20 de 1.324 itens, encontra o nome inglês `3/4 sit-up`, mostra `Abdominal 3/4` e suas instruções oficiais, e permite adicionar à rotina de demonstração. A inclusão foi confirmada na interface.
