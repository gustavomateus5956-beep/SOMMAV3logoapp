# SOMMA+ — Workout Engine — Etapa 3

Entrega: 30/09/2026. Base exclusiva: `SOMMA-workout-engine-etapa-2.zip`. Etapas 1/2 mantidas e estendidas de forma aditiva. Etapa 4, Load Engine e automação de métodos não iniciadas.

## 1. Auditoria

A auditoria anterior às alterações está em `docs/workout-engine-3-audit.md`.

- `ActiveWorkoutModal` e a finalização alternativa em `WorkoutContext` duplicavam volume e PR, assumindo uma carga e um número de repetições por série.
- Contadores de séries, progresso e Muscle Map dependiam de `completed`. O Muscle Map pondera séries por músculos primários/secundários (1 e 0,5), sem usar tonelagem.
- O contrato de segmentos existia, mas não havia confirmação individual nem vínculo entre etapas prescritas e conclusão.
- O histórico armazenava a estrutura, mas mostrava somente carga/reps planos e exibia check em séries incompletas. Sua tabela agora distingue não iniciada, parcial e concluída.
- `ExerciseDetailModal` recalculava volume de cada exercício por campos planos. A integração de segmentos é aplicada a novos registros com `metricsVersion: 1`; registros anteriores conservam a política anterior.
- Identidades, blocos, storage, repository, repetição e serialização já existiam. Foram utilizados; não foram reconstruídos.

## 2. Regra oficial de série composta

Uma prescrição continua vinculada a uma única `SetPerformance`. `SetPerformance.segments` contém uma principal (`PRIMARY`, ordem 0), seguida de `DROP` ou `REST_PAUSE`, conforme o método. Os IDs dos segmentos permanecem estáveis na edição e na persistência.

Cada entrada representa uma etapa de execução; a pausa é metadado da etapa, nunca uma série ou segmento separado. `STANDARD` e `AMRAP` continuam sem segmentos explícitos por padrão. AMRAP não presume falha muscular nem RIR 0.

A quantidade obrigatória deriva de `MethodConfig`: principal + `drops.length` ou principal + `pauses.length`. Não são calculadas cargas, percentuais ou progressões. Todas as etapas desse plano são obrigatórias para conclusão. Etapas adicionais, se registradas pela API, continuam pertencendo à mesma série e precisam ser confirmadas antes da conclusão; a interface cria somente as etapas prescritas.

## 3. Volume e repetições

`setMetrics` e `workoutMetrics` são as funções centrais. Somam apenas observações confirmadas:

`volume = Σ(carga do segmento × repetições do segmento)`

Exemplo: 80 × 9 + 65 × 10 + 52,5 × 11 = **1.947,5 kg** e **30 repetições realizadas**. Com apenas as duas primeiras etapas confirmadas: **1.370 kg**, 19 repetições e nenhuma série concluída. A série parcial contribui com seu trabalho já realizado.

Drafts, etapas não confirmadas e pausas não entram na soma. Peso corporal/carga zero mantém a regra atual: zero kg de volume externo, sem estimar massa corporal. Carga desconhecida permanece ausente no segmento e também não acrescenta volume; as repetições confirmadas continuam contadas. O campo plano obrigatório recebe zero somente como projeção de compatibilidade quando a principal não tem carga; o segmento conserva a ausência. Valores negativos/não finitos e repetições fracionárias são rejeitados.

## 4. Contagem de séries

| Métrica | Drop Set completo com dois drops |
| --- | ---: |
| `prescribedSets` | 1 |
| `completedSets` | 1 |
| `performedSegments` | 3 |
| `performedReps` | 30 |

Uma série simples concluída equivale a um segmento implícito para métricas, sem criar uma entrada artificial em JSON. As duas finalizações gravam snapshots `totalPrescribedSets`, `totalPerformedSegments`, `totalPerformedReps`, além dos totais existentes.

Muscle Map, contagem da sessão e progresso usam conclusão da série principal. Três segmentos não viram três séries musculares. Uma série parcial ainda não acrescenta série concluída ao mapa; a visualização planejada continua seguindo a regra anterior quando não há nenhuma série concluída. Não foram alterados pesos, mapeamento anatômico, normalização ou componentes visuais do Muscle Map.

## 5. Conclusão parcial/completa e interrupção

`setExecutionState` deriva os estados, sem armazenar uma segunda fonte de verdade:

- `NOT_STARTED`: nenhuma etapa confirmada e sem interrupção declarada. Digitar números não confirma execução.
- `PARTIAL`: pelo menos uma etapa executada, ou interrupção explícita, mas série ainda não concluída.
- `COMPLETED`: confirmação final manual, todas as etapas obrigatórias presentes/executadas e nenhuma interrupção ativa.

Salvar todas as observações não conclui automaticamente a série: o usuário confirma em “Concluir série composta”. Interromper conserva as observações e volume; retomar/concluir é uma decisão manual. Desmarcar etapa e salvar reabre a série. O validador recusa simultaneamente concluída + interrompida, etapas ausentes, IDs/ordens duplicados, tipo incompatível e conclusão sem reps observadas. Reps zero são permitidas quando explicitamente observadas; não geram volume.

`SetPrescription.completionRule = ALL_PRESCRIBED_SEGMENTS` identifica planos definidos nesta etapa e impede que o checkbox legado conclua um plano sem segmentos. É opcional para compatibilidade: não se inventa esse contrato em registros antigos. Segmentos explicitamente confirmados também ativam a validação rigorosa.

## 6. Histórico, persistência e repetição

O histórico mostra o método canônico e as etapas abaixo da mesma série, com principal, drops/rest-pauses, ordem, carga, reps, esforço observado, pausa observada e estado parcial/completo/interrompido. Os alvos continuam em sua coluna própria.

Não há migração de storage nem regravação em leitura. Os totais históricos previamente armazenados não são recalculados. Segmentos antigos sem flag individual são lidos segundo a confirmação da performance pai, sem inventar configuração ou observação individual. A nova flag é opcional no contrato, obrigatória nos novos comandos de registro manual.

O rascunho usa a persistência existente por usuário. Minimizar, reabrir e recarregar conservaram os registros salvos. O editor mantém alterações locais até o usuário salvar; cancelar abandona somente as edições ainda não salvas. Não há salvamento a cada tecla.

Repetir treino mantém a prescrição das etapas, blocos e descansos. A nova performance começa não concluída, sem segmentos executados, esforço ou interrupção anteriores. Novos IDs continuam sendo atribuídos pela Etapa 2. A referência anterior usa somente a principal; ela não é copiada como nova execução.

## 7. Política de PR/referência

Não foi criado novo sistema de PR. `primaryPerformance` retorna somente `PRIMARY` confirmado; `intensitySegments` distingue observações de intensidade. A projeção plana de carga/reps representa a principal, nunca o último drop nem a carga máxima de todos os segmentos.

`isPrimaryPr` conserva a regra simples existente: série inteiramente concluída, carga principal maior que a referência anterior e reps principais pelo menos iguais às anteriores. Uma série parcial não ganha PR. Um drop com carga menor ou mesmo maior não substitui arbitrariamente a referência principal.

O detalhe de exercício usa volume segmentado nos novos registros e referência principal para carga/estimativa de 1RM. Seu mecanismo preexistente de localização de exercícios por nome e dados demonstrativos não foi redesenhado nesta etapa.

## 8. Integração de SetPerformanceSegment e interface mínima

Os contratos anteriores foram mantidos. Extensões opcionais:

- `SetPerformanceSegment.completed`: confirmação de execução da etapa;
- `SetPerformance.interrupted`: interrupção manual;
- `SetPrescription.completionRule`: política explícita de conclusão, conservada na repetição;
- snapshots de métricas em `WorkoutSessionRecord`.

`compoundSets.ts` fornece `prescribeCompoundStages`, `segmentDrafts`, `recordCompoundPerformance` e `validateCompoundPerformance`. `setMetrics.ts` centraliza os consumidores. `normalizeSet` projeta somente a principal nos campos planos. A serialização valida o novo formato mantendo o legado.

O botão “Registrar etapas” aparece apenas nos métodos compostos. O editor permite definir quantidade prescrita, registrar/editar carga, reps, RIR/RPE observados, pausa realizada e confirmação individual. Rest-Pause exige uma pausa prescrita explícita ao criar o plano; não assume duração por conta própria. As pausas observadas são independentes das prescritas.

Após salvar segmentos, a alteração do método e os inputs planos são bloqueados para evitar fontes divergentes; edição da execução continua disponível no editor. Não há reformulação das telas.

O descanso global após conclusão de uma série inteira usa `completeSetInContext` já existente. Salvar etapas parciais não agenda pausa; nenhum timer intra-set, scheduler Superset ou redução automática de carga foi implementado. O trecho inteiro do ticker global foi comparado com a base e permaneceu idêntico.

## 9. Arquivos criados

- `docs/workout-engine-3-audit.md`
- `docs/workout-engine-3.md`
- `docs/validation/workout-engine-3-tests.log`
- `docs/validation/workout-engine-3-typescript.log`
- `docs/validation/workout-engine-3-build.log`
- `scripts/validate-compound-sets.test.ts`
- `src/components/active-workout/CompoundSetEditor.tsx`
- `src/features/workout-engine/compoundSets.ts`
- `src/features/workout-engine/setMetrics.ts`

## 10. Arquivos alterados e escopo preservado

- `package.json`
- `src/components/ActiveWorkoutModal.tsx`
- `src/components/WorkoutSessionDetailModal.tsx`
- `src/components/active-workout/ActiveWorkoutExerciseCard.tsx`
- `src/components/exercise/ExerciseDetailModal.tsx`
- `src/context/WorkoutContext.tsx`
- `src/features/muscle-map/sommaMuscleMapAdapter.ts`
- `src/features/workout-engine/contracts.ts`
- `src/features/workout-engine/serialization.ts`
- `src/features/workout-engine/setAdapter.ts`
- `src/features/workout-engine/workoutStructure.ts`
- `src/types.ts`

Comparação binária com o ZIP base: **12 arquivos originais alterados, 175 originais idênticos, nenhum removido**. Nenhum teste existente foi removido ou modificado; a nova suíte foi adicionada ao comando Workout Engine.

Continuam intactos os arquivos de Nutrição/TACO/Dieta/AddFoodModal, catálogo de exercícios e mídias, Home, Pass, Perfil, limites Free e componentes de rotinas. `WorkoutBlock`, seu adapter visual, storage da sessão, repository e `WorkoutView` não foram alterados. Em `workoutStructure`, somente os consumidores de PR/referência foram ajustados; operações de blocos/identidade permanecem iguais.

## 11. Testes

**158 testes executados: 157 aprovados e 1 falha conhecida.** Os **31 testes novos** passaram.

Cobertura nova: Standard sem segmentos; Drop Set com dois drops; Rest-Pause; AMRAP; drafts/ausências; parcial/completa/interrompida; retomar/editar; volume; reps; contagem de séries e segmentos; etapas faltantes; validação numérica/IDs/ordem/tipo; prescrição separada de execução; bodyweight; PRIMARY/PR; serialização; histórico; leitura sem regravação; repetição limpa; Muscle Map; Superset composto; rascunho e descansos; pausa prescrita distinta da observada.

Também passaram as suítes existentes de Workout Engine, Workout Method Engine, WorkoutBlock, Routine Limit, Rest Engine, Muscle Map e Nutrição. Os testes do catálogo que não dependem dos arquivos físicos passaram.

Falha mantida, sem skip/máscara: `validate-somma-catalog.test.ts`, teste “1324 JPGs and 1324 GIFs exactly match manifest IDs and mediaIds; no missing or orphan files”. Erro `ENOENT` em `public/exercises/images`, ausente na base leve. As mídias não foram fabricadas nem substituídas. O comando completo continua retornando código 1 por essa falha.

Log integral: `docs/validation/workout-engine-3-tests.log`.

## 12. Validação manual

Executada pelo navegador em `http://127.0.0.1:3003/`, conta de demonstração local, dados fictícios:

1. Iniciar rotina A e abrir o Drop Set existente do supino inclinado.
2. Definir duas etapas de intensidade, registrar principal 80 × 9 (RIR 1) e primeiro drop 65 × 10; salvar parcial.
3. Confirmar 1.370 kg e zero séries concluídas.
4. Minimizar, recarregar a página, reabrir e confirmar valores/estado preservados.
5. Registrar segundo drop 52,5 × 11 (RPE 9); concluir: 1.947,5 kg, uma série concluída, três segmentos. Descanso global inicia em 2:00; foi pulado manualmente.
6. Criar Superset com inclinado A1 e supino reto A2; preservar os segmentos já registrados.
7. Abrir Rest-Pause da extensão de tríceps; prescrever duas etapas com pausa de 15 s. Registrar 25 × 12 + 25 × 4, pausa observada 15 s e interromper antes da terceira etapa.
8. Confirmar total 2.347,5 kg e apenas uma série concluída (400 kg da série parcial incluídos).
9. Concluir e salvar treino. Histórico mostra Superset, Drop Set completo, Rest-Pause parcial/interrompido, esforço, pausa e etapa não executada como desconhecida.
10. Repetir treino: Superset/prescrição restaurados; volume zero, zero séries e segmentos realizados; referência principal anterior 80 × 9, novo alvo 26 × 12. Editor abre três etapas desmarcadas, esforço anterior ausente.
11. Cancelar e descartar apenas o novo rascunho de teste.
12. Abrir o build final compilado e o histórico salvo; conferir novamente. Abertura em aba nova sem erros de console.

Evidências externas entregues: `WORKOUT-ENGINE-3-historico.png` e `WORKOUT-ENGINE-3-segmentos.png`. O registro demonstrativo ficou apenas no armazenamento local da origem de teste; não está no código/ZIP.

Durante edição com servidor de desenvolvimento, o Fast Refresh invalidou os providers (`useUser`/`useWorkout`) e exigiu recarga da página. Esse evento de HMR foi observado e não ocultado; a recarga e a abertura limpa do build final funcionaram. Não houve esse erro na nova aba da versão compilada.

## 13. TypeScript

**Aprovado**, código 0. Equivalente local de `npx tsc --noEmit`:

```text
node node_modules/typescript/bin/tsc --noEmit
```

`npm`/`npx` não estavam disponíveis no PATH da sessão. Foram usados diretamente os executáveis instalados no projeto, sem instalar ou atualizar dependências. Dependências locais foram reutilizadas por junction, que não integra o ZIP.

## 14. Build

**Aprovado**, código 0. Equivalente local de `npm run build`:

```text
node node_modules/vite/bin/vite.js build
```

Vite 8.3.1: 1.793 módulos; JS principal 2.739,11 kB (gzip 477,92 kB), CSS 84,53 kB (gzip 13,21 kB). Mantidos avisos de chunks maiores que 500 kB e uso de `__dirname` no `vite.config.ts`; não foram silenciados.

Comando de testes utilizado no ambiente:

```text
node --import 'data:text/javascript,process.geteuid=()=>0' --import tsx --test scripts/*.test.ts
```

A adaptação `geteuid` é restrita ao processo de teste neste runtime Windows; não altera o produto. Logs TypeScript/build incluídos em `docs/validation` (log TypeScript vazio indica ausência de diagnósticos).

## 15. ZIP atualizado

`SOMMA-workout-engine-etapa-3.zip`, com a raiz `SOMMA-consolidado/`, fonte completa, documentação e logs. Excluídos somente `node_modules`, `dist` e metadados Git. Integridade CRC e igualdade de cada entrada com o projeto verificados no empacotamento. Nenhum arquivo original removido.

SHA-256 da base obrigatória: `7a59fe141aa629a229996dff616900f1182e091eb465ab420d410e8090e85591`.

## 16. Próximos passos (não executados)

1. Homologar o editor manual em aparelhos móveis reais e com cenários de pausa/interrupção escolhidos pelo produto.
2. Definir a especificação da próxima etapa, incluindo política de cargas e transições, antes de autorizar qualquer automação.
3. Quando autorizado, fazer os futuros consumidores de métricas/PR usarem `setMetrics`, `primaryPerformance` e a política de conclusão, mantendo a mesma suíte de regressão.

Entrega encerrada nesta Etapa 3. Nenhuma implementação de Load Engine, Drop Set automático, Rest-Pause automático, AMRAP runtime, progressão ou scheduler foi iniciada.
