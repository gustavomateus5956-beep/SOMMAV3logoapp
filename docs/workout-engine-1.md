# SOMMA+ — Workout Engine — Etapa 1

Concluída em 29/09/2026. Base exclusiva: `SOMMA-consolidado-nutricao2-workout-visual.zip`. A Etapa 2 não foi iniciada. Nenhuma automação de métodos/carga/progressão foi acrescentada.

## 1. Arquitetura atual encontrada

A auditoria foi registrada antes de alterar código em `docs/workout-engine-1-audit.md`.

`WorkoutView` guarda as rotinas em estado React, inicialmente `INITIAL_ROUTINES`. Há limite provisório de quatro rotinas, verificado na abertura e na criação; treino vazio usa `onStartRoutine(null)`. Não há repository de rotinas nem assinatura real.

`WorkoutContext` guarda a sessão ativa e seu cronômetro em memória, clona exercícios da rotina e consulta o desempenho anterior por nome/posição de série. O Rest Engine global continua quando o modal é minimizado. `ActiveWorkoutModal` mantém a projeção local dos exercícios, inputs, conclusão de série, configurações e agrupamentos. `ActiveWorkoutExerciseCard` apresenta campos planos, badges, metas e ações. `ExerciseSet` já tinha `role`, `method`, metas e resultados planos, mas não separava objetos de prescrição e execução.

Histórico: modal e contexto possuem caminhos próprios de finalização, delegando a `LocalWorkoutRepository` e `storageService`. O storage usa JSON por usuário no localStorage. O Muscle Map calcula a partir de exercícios e séries concluídas. O Superset visual usa `activeBlocks`, local ao modal, sem scheduler ou persistência.

## 2. Problemas e acoplamentos

- Os dois mappers de histórico descartavam role, method, faixa, esforço e descanso.
- Campos planos misturavam configuração e valores de execução; RIR/RPE da configuração não podem ser tratados como resultado observado.
- A inicialização local do modal podia substituir uma sessão existente após minimizar/reabrir.
- Repetir um histórico perdia configurações das séries.
- Referência anterior continua sendo encontrada por nome e índice, não por identidade persistente de série.
- Os blocos visuais continuam locais e se perdem na desmontagem. Migrá-los demanda identidade estável de instâncias de exercício e tratamento de edição/remoção de membros.
- O storage existente captura erros internamente. Esta etapa não muda seu contrato nem introduz persistência da sessão ativa.

## 3. Arquitetura final adotada

Contratos puros em `src/features/workout-engine/contracts.ts`, adaptação em `setAdapter.ts`, ponte de blocos em `blocks.ts`, validação e codecs em `serialization.ts`.

`ExerciseSet` e `CompletedSetLog` recebem `prescription` e `performance` opcionais para aceitar registros antigos. Normalização cria cópias independentes em memória, com `schemaVersion: 1`. Depois de normalizado, os objetos canônicos têm precedência; campos planos são projeções de compatibilidade para a UI e consumidores existentes. Edição de execução usa `updatePerformance`; configuração usa `updatePrescription`. Os dois caminhos de histórico usam `toCompletedSetLog`.

Os nomes públicos `SET_ROLES.WARMUP/WORKING/TOP_SET/BACKOFF` e `SET_METHODS.STANDARD/DROP_SET/REST_PAUSE/AMRAP` mantêm os valores wire já existentes (`warmup`, `working`, `top_set`, `backoff`; `normal`, `dropset`, `rest_pause`, `amrap`). Evita-se migração desnecessária de enums.

## 4. SetPrescription

Contém função, método, carga kg, reps, faixa textual, RIR/RPE, descanso, instrução, configuração específica e regra de carga. Dados desconhecidos permanecem ausentes. `targetWeight/targetReps` legados alimentam os alvos; `weight/reps` antigos NÃO são promovidos automaticamente a prescrição. A faixa é preservada sem inferir uma contagem exata. RIR/RPE do sheet atual continuam metas.

Exemplo validado: prescrição de 80 kg, 8–10 reps, RIR 2 coexiste com execução de 82,5 kg, 9 reps, RIR 1. Atualizar execução não altera prescrição. Alterar configuração não altera resultado. As funções retornam cópias, sem compartilhar objetos aninhados com o registro de origem.

## 5. SetPerformance

Contém carga/reps efetivas, RIR/RPE observados opcionais, `completed` e segmentos opcionais. Valores preenchidos antes do check são rascunho; não significam série realizada. A UI atual não ganhou novos inputs de esforço realizado. O contrato permite registrá-lo posteriormente sem reutilizar a meta.

Campos planos `weight/reps/completed` seguem atendendo às métricas, histórico visual, Rest Engine e Muscle Map. Ao repetir um histórico, alvos permanecem, valores anteriores continuam referências, e o novo resultado tem `completed:false`, sem esforço observado ou segmentos copiados da sessão anterior.

## 6. SetPerformanceSegment

Cada segmento tem id, ordem, tipo PRIMARY/DROP/REST_PAUSE, carga, reps, esforço e descanso anterior opcionais. Segmentos ficam dentro de UMA performance de UMA série. O teste com 80×9, 65×10 e 52,5×11 preserva os três registros no round-trip JSON sem criar três séries concluídas.

Não existe criação automática de segmentos nem alteração das métricas atuais para agregá-los. Uma etapa futura deverá definir explicitamente volume/PR para séries compostas antes de conectar sua execução à UI.

## 7. MethodConfig

União discriminada por método: normal, `DropSetConfig` com etapas e regras de carga, `RestPauseConfig` com pausas e metas, `AmrapConfig` com limite temporal/repetições e RIR opcional. Não determina falha obrigatória. Codecs rejeitam configuração incompatível. Trocar o método remove a configuração específica do método anterior; os resultados são mantidos. Nenhuma regra é executada.

## 8. WorkoutBlock

Contrato versionado com STANDARD/SUPERSET, id, nome opcional, ordem, IDs ordenados dos exercícios, descanso entre exercícios e após bloco. STANDARD possui um membro; SUPERSET aceita dois ou mais no contrato. Validação rejeita IDs de bloco/ordens duplicados, membros ausentes ou reutilizados e descansos negativos.

`VisualWorkoutBlock` representa exatamente o formato atual; `WorkoutBlockLocal` é seu alias. `fromVisualBlock` e `toVisualBlock` fazem ponte explícita e preservam biset/superset e descanso zero. A ponte de volta rejeita mais de dois membros ou descansos não informados, pois a UI atual só renderiza pares. Não trunca nem inventa descanso.

Estratégia de substituição futura: dar IDs únicos a instâncias repetidas de exercícios; tornar `WorkoutBlock[]` a fonte da sessão/rotina; projetar o formato visual por adapter; sincronizar criar/inverter/desagrupar/remover membro; persistir e restaurar blocos no histórico. Somente depois conectar scheduler. Nesta entrega, `activeBlocks` permanece local e seu comportamento visual não muda. Os campos opcionais `blocks` e os codecs já permitem armazenar o contrato quando esse fluxo for adotado, mas os handlers atuais NÃO persistem seus blocos visuais.

## 9. LoadRule e LoadIncrement

ABSOLUTE usa `weightKg`. PERCENT_PREVIOUS/PERCENT_TOP_SET/PERCENT_WORKING_LOAD usam `percent` (80 significa 80%), referência opcional por ID e incremento opcional. `LoadIncrement` registra quantidade em kg e arredondamento nearest/up/down. Contratos e validação apenas: não há cálculo, sugestão ou modificação automática de carga.

## 10. Compatibilidade legado e escopo preservado

- Sem role/method/type informativos: working/normal. `type=warmup/dropset/rest_pause/amrap` mantém seu significado por fallback. Role/method explícitos prevalecem. `max_strength/failure` são preservados em type sem inventar equivalência a Top Set/AMRAP.
- Não há migração em massa, exclusão de campos ou regravação ao ler histórico. O repository adapta em memória; grava novos registros mantendo campos anteriores e novos objetos.
- `serializeSet/deserializeSet` e `serializeSession/deserializeSession` validam a fundação e suportam JSON legado. O repository usa normalização tolerante, e não aplica a validação estrita a todo histórico antigo.
- Rotinas mantêm seus valores e checks originais, inclusive dados demonstrativos preexistentes. Treino vazio permanece vazio e ilimitado; limite Free 4 e métodos livres continuam intactos.
- Nenhuma alteração em Dieta, NutritionCatalogService, catálogo TACO (597 alimentos), Muscle Map, Rest Engine, catálogo de exercícios, Home, Pass ou Perfil. O contexto foi adaptado nos pontos de dados; suas rotinas de timer/descanso não foram alteradas.
- As classes estáticas de UI dos dois componentes alterados foram comparadas com a base e permanecem iguais. ActiveWorkoutExerciseCard e sheets permanecem byte a byte iguais.

## 11. Arquivos criados

- `src/features/workout-engine/contracts.ts`
- `src/features/workout-engine/setAdapter.ts`
- `src/features/workout-engine/blocks.ts`
- `src/features/workout-engine/serialization.ts`
- `scripts/validate-workout-foundation.test.ts`
- `docs/workout-engine-1-audit.md`
- `docs/workout-engine-1.md` (este relatório)

## 12. Arquivos alterados

- `src/types.ts`: campos aditivos nos modelos.
- `src/context/WorkoutContext.tsx`: adaptação ao iniciar, referência anterior como execução, normalização e mapper de histórico.
- `src/components/ActiveWorkoutModal.tsx`: edições separadas, proteção da sessão ao remontar, mapper de histórico e alias do bloco visual.
- `src/components/WorkoutView.tsx`: repetição do histórico preservando prescrição e reiniciando execução.
- `src/data/repositories/LocalWorkoutRepository.ts`: adaptação aditiva de leitura/gravação.
- `package.json`: comando `test:workout-engine`; nenhuma dependência nova.

## 13. Testes

18 testes novos aprovados; suíte completa: **98 testes, 97 aprovados, 1 falha conhecida**. Cobertura nova: legado, todos os pares role/method, precedência canônica, prescrição versus execução, cópias independentes, segmentos, configurações, regras de carga, dados inválidos, serialização/deserialização, rotinas existentes, treino vazio, repetir histórico, blocos, ponte visual, repository/localStorage, Muscle Map e pontos de integração do descanso.

Também executadas as suítes existentes de Nutrição (24 aprovados), método visual (13), limite Free (9), descanso (10), Muscle Map e catálogo de exercícios.

A falha foi mantida visível: teste que exige 1324 JPGs e 1324 GIFs do manifesto não encontra `public/exercises/images/` na base leve. Não foram criados placeholders para mascará-la nem alterado o teste.

Verificação no navegador, origem local isolada porta 3001: login de demonstração, rotina existente, edição 82,5 kg × 9, configuração Top Set/8–10/RIR2, check, descanso 120s, minimizar e reabrir com valores/configuração preservados e descanso contando. Muscle Map renderizado. Treino vazio abriu com zero séries/exercícios. Captura em `WORKOUT-ENGINE-1-validacao.png`. Persistência completa da UI não foi validada manualmente no navegador; round-trip/repository foram verificados nos testes automatizados. Superset foi validado pela ponte e pela suíte visual existente, sem afirmar teste manual completo de seu fluxo.

## 14. TypeScript

**Aprovado**, sem erros. npm/npx não estão disponíveis no PATH deste ambiente. Foi executado o compilador instalado diretamente: `node node_modules/typescript/bin/tsc --noEmit`, equivalente ao conteúdo de `npx tsc --noEmit`, sem instalar dependências.

## 15. Build

**Aprovado** via `node node_modules/vite/bin/vite.js build`, o mesmo Vite usado por `npm run build`. Permanecem avisos de `__dirname` na configuração Vite e chunks maiores que 500 kB. Não foram suprimidos. Os testes usaram o runner tsx instalado e um ajuste apenas no processo de teste para o ambiente Windows (`process.geteuid`); esse ajuste não integra o aplicativo.

## 16. ZIP atualizado

`SOMMA-workout-engine-etapa-1.zip`: projeto completo sobre a base consolidada, sem node_modules/dist e sem mídias que não estavam na base. Relatório incluído em docs. Nenhum arquivo original removido. Comparação binária limita alterações aos seis arquivos listados acima; demais arquivos originais permanecem iguais. Arquivo ZIP validado por CRC e comparação dos conteúdos.

## 17. Próximos três passos (não executados)

1. Adotar WorkoutBlock como fonte persistente, com IDs de instância estáveis e compatibilidade explícita de criação/ordem/remover membros/restauração.
2. Implementar registro manual de segmentos e esforço realizado, definindo volume/PR/histórico para séries compostas e testes de ponta a ponta.
3. Implementar Load Engine e automações de métodos em etapas próprias, depois de definir referências, arredondamento, cancelamento e integração com descanso.

Fim da Etapa 1.

SHA-256 da base: `5b86e338159207bee615f82017ffa1828e0cde908b24fb7ef673dd0add9c86af`.
