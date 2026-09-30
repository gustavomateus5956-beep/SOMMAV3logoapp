# SOMMA+ — Workout Engine — Etapa 2

WorkoutBlock persistente e identidade estável. Concluído em 29/09/2026. Base exclusiva: `SOMMA-workout-engine-etapa-1.zip`. A fundação da Etapa 1 foi reaproveitada; não há Load Engine, scheduler de Superset, Drop Set automático, Rest-Pause automático, AMRAP runtime, progressão, Tri-set/Giant/Circuit ou Etapa 3.

## 1. Auditoria anterior à implementação

Registrada em `docs/workout-engine-2-audit.md` antes das alterações.

Exercise.id era reutilizado entre catálogo/rotina/sessão, permitindo colisão ao adicionar o mesmo exercício. activeBlocks existia somente no modal e não era salvo. Criar/inverter atualizava agrupamento e exercícios separadamente; excluir membro podia deixar referência órfã. O contexto e o modal tinham caminhos próprios de finalização que não incluíam blocks. O histórico não carregava identidade de instância/catalogRef e sua repetição não restaurava agrupamentos. Não existia rascunho persistente da sessão ativa. A lista de histórico também precisava atualizar após a finalização sem exigir nova navegação.

## 2. Identidade escolhida

Cada ocorrência recebe `exerciseInstanceId = exercise-<crypto.randomUUID()>`. Esse ID permanece durante edição, inversão, minimização, remontagem, recarga e gravação no histórico. O campo id da projeção ativa usa o mesmo valor, mantendo compatibilidade com chaves React e callbacks existentes.

`catalogRef` continua sendo a referência ao catálogo; `legacyExerciseId` conserva o ID de origem. CompletedExerciseLog guarda exerciseInstanceId, catalogRef e exerciseId legado em campos separados. Dois supinos iguais compartilham catalogRef e têm UUIDs diferentes. Nome e posição no array não geram identidade persistente. Novas sessões geram novos IDs de exercícios, séries e blocos, remapeando os membros.

A busca de referências anteriores no contexto passa a usar referência explícita de catálogo/ID legado. Não associa exercícios por nome. Se o histórico apresenta ocorrências duplicadas e não há atribuição segura, a referência ambígua não é usada. Repetir histórico usa as referências daquela ocorrência específica.

## 3. Arquitetura final de WorkoutBlock

`WorkoutStructure = { exercises, blocks }`. O contexto da sessão é a fonte única de ambos. STANDARD contém um exercício; SUPERSET contém exatamente dois nesta versão. O contrato original permanece preparado para extensões, mas a estrutura ativa recusa três ou mais membros.

A validação garante identidades únicas, cobertura completa, ausência de membros órfãos/duplicados, ordens válidas e coerência entre ordem dos blocos, ordem de membros e lista visual. O array de exercícios é ordenado a partir dos blocos. Operações retornam cópias e são aplicadas atomicamente ao contexto.

## 4. Substituição de activeBlocks

Não existe mais `setActiveBlocks` nem estado local de agrupamentos. O nome activeBlocks permanece apenas como projeção memoizada:

`activeSession.blocks → filtrar SUPERSET → toVisualBlock → componentes visuais existentes`.

Os exercícios também deixaram de ter uma segunda cópia de estado no modal. Cards, sheets, botões e layout foram mantidos. A edição do nome do treino agora usa o contexto, acompanhando o rascunho persistido. O histórico identifica SUPERSET/A1/A2 no título já existente do exercício, sem novo componente ou redesenho.

## 5. Criação, remoção e reordenação

| Operação | Resultado |
|---|---|
| Iniciar sem blocks | Um STANDARD por ocorrência; nunca infere Superset |
| Adicionar exercício | Nova instância UUID, novo STANDARD ao final, execução não concluída |
| Criar Superset | Une dois STANDARD independentes, A1 escolhido e A2 selecionado; reposiciona A2 junto a A1 |
| Adicionar ao bloco | Segundo membro transforma STANDARD em SUPERSET; terceiro é recusado |
| Inverter A1/A2 | Inverte somente ordem das referências; identidade, prescrição e execução acompanham o exercício |
| Remover membro do bloco | Ambos ficam no treino como STANDARD, preservando ordem e dados |
| Desfazer Superset | Converte o par em dois STANDARD, preservando séries e metadados de descanso |
| Excluir exercício STANDARD | Remove exercício e bloco correspondente |
| Excluir membro do par | Exclui a ocorrência; sobrevivente vira STANDARD sem referência órfã |
| Ajustar descanso | Atualiza descanso entre membros e após bloco; aceita zero e rejeita negativos/não finitos |

Os descansos permanecem registrados quando um bloco se torna STANDARD; nesse estado não disparam comportamento novo. A posição do último exercício ativo é remapeada por identidade nas operações estruturais. Mudanças em séries mantêm a estrutura dos blocos. Adicionar/remover séries foi ajustado para não mutar arrays pertencentes ao contexto.

## 6. Persistência

A sessão ativa usa o mesmo localStorage da arquitetura existente, com chave `somma_active_workout_v1_<userId>`, por meio de três métodos pequenos acrescentados ao storageService. Não há backend ou banco novo.

`activeWorkoutStorage.ts` serializa um envelope versionado contendo sessão, estrutura e estado active/minimized/completed. Restaura datas e valida a estrutura. O contexto hidrata por usuário, evita salvar dados do usuário anterior na nova conta e persiste atualizações. A sessão finalizada, ainda na tela de confirmação antes de salvar, também tem contrato de rascunho. Ao salvar/sair ou descartar, o rascunho é limpo. A sessão não passa a depender do ciclo de vida do modal.

Os dois caminhos de finalização (modal e contexto) gravam blocks e o mesmo mapper de exercício com identidade, metadados e séries. O LocalWorkoutRepository existente continua usando normalizeSession; não foi redesenhado. Metadados anatômicos, equipamento, mídia e referência de catálogo são preservados nos novos registros, permitindo repetição sem perder os dados usados pelo Muscle Map.

O Rest Engine mantém seu tick e suas ações originais. Configurar descanso do bloco não agenda a próxima série nem substitui o descanso global do exercício. Recarregar retoma os valores de tempo salvos; não foi acrescentado cálculo de tempo transcorrido com o navegador fechado. O rascunho é local ao navegador/origem, não sincroniza dispositivos.

## 7. Legado e repetição

Histórico antigo sem blocks é adaptado somente em memória para STANDARD, sem regravar o registro original durante a leitura. Não há agrupamento por proximidade, nome ou semelhança. A primeira adaptação de dados antigos sem identidade atribui UUIDs à cópia; como o registro original não é migrado, uma leitura independente pode criar outra identidade temporária. A nova sessão e os novos registros persistem suas identidades explicitamente, mantendo-as estáveis daí em diante.

Blocos legados explícitos com referências únicas podem ser remapeados. Referência ambígua é rejeitada, não associada arbitrariamente. Os testes cobrem o caso de dois exercícios com mesmo ID de origem.

Ao repetir, a prescrição e a ordem/descanso do bloco são restauradas e os IDs são renovados. `SetPerformance` inicia com `{ schemaVersion:1, completed:false }`, sem carga/reps realizadas, esforço observado ou segmentos antigos. Valores anteriores ficam em prevWeight/prevReps. Inputs podem mostrar a prescrição como rascunho; isso não conta como execução. Ao editar/check, a execução é registrada separadamente. Rotinas novas também começam não concluídas. O limite Free 4, treino vazio ilimitado e métodos livres foram preservados.

## 8. Arquivos criados

- `src/features/workout-engine/workoutStructure.ts`: identidade, invariantes, operações de blocos, histórico e repetição.
- `src/features/workout-engine/activeWorkoutStorage.ts`: codecs e acesso ao rascunho local.
- `scripts/validate-workout-blocks.test.ts`: 29 testes novos.
- `docs/workout-engine-2-audit.md`: auditoria anterior às alterações.
- `docs/workout-engine-2.md`: este relatório.

## 9. Arquivos alterados

- `src/types.ts`: identidade e metadados opcionais no legado; marcador de rotina derivada do histórico.
- `src/context/WorkoutContext.tsx`: fonte canônica da estrutura, operações atômicas, hidratação/persistência, finalização com blocks e referência por identidade.
- `src/components/ActiveWorkoutModal.tsx`: projeção de blocos, uso do contexto, operações estruturais e gravação.
- `src/components/WorkoutView.tsx`: repetição com adapter e atualização da lista após finalizar.
- `src/components/WorkoutSessionDetailModal.tsx`: chave por instância e identificação textual do agrupamento no título existente.
- `src/features/workout-engine/serialization.ts`: adaptação de identidade e blocos no registro estruturado.
- `src/services/storageService.ts`: acesso local ao rascunho por usuário.
- `scripts/validate-workout-foundation.test.ts`: duas expectativas da Etapa 1 atualizadas para a projeção canônica e referências remapeadas, sem retirar cobertura.
- `package.json`: inclusão da suíte de blocos em test:workout-engine, sem novas dependências.

Os arquivos da fundação contracts.ts/setAdapter.ts/blocks.ts foram reaproveitados sem alteração. As áreas de Nutrição/TACO/AddFoodModal/Dieta, Muscle Map, catálogo de exercícios, Home, Pass e Perfil ficaram byte a byte iguais à base. Os componentes e configuração do Rest Engine também; no contexto, o trecho completo do timer foi comparado com a base e é idêntico. Classes estáticas dos três componentes visuais alterados permanecem iguais.

## 10. Testes

**127 testes executados: 126 aprovados, 1 falha conhecida.** Os 29 testes novos de blocos passaram. Também passaram Workout Foundation, Workout Method Engine, Routine Limit, Rest Engine, Muscle Map e os 24 testes de Nutrição.

Cobertura nova: UUIDs únicos com catálogo repetido; normalização idempotente da estrutura identificada; legado sem agrupamento; referências ambíguas; STANDARD/SUPERSET; segundo membro e recusa do terceiro; A1/A2; inversão em ambas as posições; remoção de membro e exercício; conversão em STANDARD; desfazer; ordem; descanso zero/inválido; prescrição e performance intactas; serialização/desserialização; repository e leitura sem escrita; rascunho por usuário e recuperação; histórico/repetição com novos IDs e execução limpa; Muscle Map e metadados; referências sem associação por nome; treino vazio; integração dos dois caminhos de finalização.

Permanece explícita a falha do catálogo leve: o teste que exige 1324 JPGs e 1324 GIFs encontra ausência de `public/exercises/images/`. Não foi mascarada, suprimida nem substituída por arquivos falsos.

## 11. Validação manual no navegador

Executada em servidor local isolado na porta 3002, usando conta demonstrativa.

1. Iniciada rotina A; zero séries concluídas.
2. Registrada uma série de supino reto com **85 kg × 9**, diferente da prescrição **84 kg × 10**.
3. Criado Superset de supino reto + inclinado.
4. Ajustada transição para **15 s** e descanso após bloco para **120 s**.
5. Invertido A1/A2: inclinado passou a A1, reto a A2.
6. Minimizado e reaberto: ordem, descansos e resultado preservados; descanso global continuou contando.
7. Recarregada a página: sessão e bloco restaurados com o resultado intacto.
8. Finalizado e salvo o treino (uma série concluída; demais pendentes), total **765 kg**.
9. Aberto o registro recém-gravado no histórico: títulos **SUPERSET 1 · A1** e **A2**, alvo **84×10** e realizado **85×9** preservados.
10. Acionado Treinar Novamente: Superset restaurado com ordem invertida, transição **15 s** e descanso **120 s**.
11. Nova execução mostrou **volume 0**, **séries 0**, todos os checks desmarcados; o resultado anterior ficou em ANTERIOR, enquanto o input voltou à prescrição **84×10**.
12. Encerrada somente a repetição criada para validação. Capturas entregues: `WORKOUT-ENGINE-2-historico.png` e `WORKOUT-ENGINE-2-repeticao.png`.

Remoção de membros, desfazer, exercício duplicado e falhas de validação foram verificados automaticamente. Não se afirma que todos esses caminhos extras foram clicados manualmente. A preservação de identidade UUID foi verificada nos codecs/repository; a UI valida ordem e conteúdo sem expor identificadores técnicos.

## 12. TypeScript

**Aprovado**, sem erros: `node node_modules/typescript/bin/tsc --noEmit`.

npm/npx não estão disponíveis no PATH deste ambiente. Foi usado diretamente o compilador instalado, equivalente ao comando solicitado `npx tsc --noEmit`, sem instalar pacotes. A suíte usa tsx instalado e um ajuste somente no processo de teste para Windows (`process.geteuid`), fora do aplicativo.

## 13. Build

**Aprovado**: `node node_modules/vite/bin/vite.js build`, o Vite definido em npm run build. Node 24.19.0, TypeScript 7.0.2 e Vite 8.3.1. CSS final: 84,32 kB; JS principal: 2.727,34 kB (473,79 kB gzip).

Permanecem os avisos preexistentes sobre __dirname no vite.config.ts e chunks acima de 500 kB; não foram suprimidos. Não houve alteração de dependências ou lockfile.

## 14. ZIP atualizado

`SOMMA-workout-engine-etapa-2.zip`: projeto completo sobre a base obrigatória, incluindo auditoria, relatório e testes. Exclui node_modules/dist e não inventa as mídias ausentes da base leve. Nenhum arquivo original removido. Comparação binária verifica o escopo de mudanças; CRC e conteúdo do ZIP verificados.

## 15. Próximos três passos (não executados)

1. Definir e testar o registro manual de segmentos/esforço realizado para métodos compostos, incluindo a apresentação no histórico.
2. Especificar métricas de séries compostas (volume, PR, conclusão parcial) antes de qualquer execução automática.
3. Projetar separadamente Load Engine e scheduler de métodos, com referências por identidade, cancelamento e regras de descanso; implementar somente após autorização da próxima etapa.

Fim da Etapa 2. Nenhuma Etapa 3 iniciada.

SHA-256 da base: `238b7c8ed186dc5f0aa6326a98225feed055fd5a0cfb8099bf8c7b2f2e054559`.

Comparação final: 9 arquivos originais alterados; 173 originais preservados integralmente.
