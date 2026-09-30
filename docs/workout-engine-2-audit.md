# Auditoria anterior às alterações — Etapa 2

Base exclusiva: SOMMA-workout-engine-etapa-1.zip. Inspeção em 29/09/2026, antes de alterar código.

- Exercise.id mistura identidade de rotina/biblioteca e instância ativa. Adição conserva exerciseData.id; o mesmo exercício pode repetir ID. catalogRef é a referência explícita ao catálogo e não deve ser substituído por UUID da sessão.
- ActiveWorkoutModal guarda exercícios locais e activeBlocks local; contexto recebe exercícios mas não blocos. Remontar perde agrupamentos e descansos de bloco.
- Criar Superset reposiciona exercícios por id e depois atualiza o array local separado; inverter altera dois estados; desfazer apenas remove agrupamento; remover exercício pode deixar membro inexistente no bloco.
- WorkoutContext inicia exercícios por clone e preenche referências anteriores por nome/índice. Essa busca é uma sugestão histórica, não identidade; repetição precisa usar referência da própria ocorrência histórica, evitando colisão entre exercícios iguais.
- Finalização existe no contexto e no modal. Os dois preservam prescription/performance da Etapa 1, porém não gravam blocos nem identidade explícita de instância/catalogRef no histórico.
- WorkoutView repete histórico construindo nova rotina, sem copiar blocks, e a Etapa 1 reaproveita carga/reps anteriores como rascunho de performance. Esta etapa precisa resultado novo limpo.
- LocalWorkoutRepository normaliza histórico em memória; storageService salva arrays JSON por usuário. Não existe draft persistido de sessão ativa.
- WorkoutSessionDetailModal usa exerciseId como chave React e renderiza lista simples; não exibe agrupamento. Manter layout e disponibilizar resumo textual no espaço existente para identificar o Superset registrado.
- Rest Engine global usa descanso de exercício e campos da sessão; descansos de bloco são apenas configuração visual. Preservar esse comportamento, sem scheduler.

Decisão: UUID por exerciseInstanceId, id projetado para a instância na sessão e legacyExerciseId preservado; WorkoutBlock[] no contexto com operações atômicas e exercícios ordenados por seus membros; activeBlocks somente derivado. Draft local versionado, histórico com blocos/identidade, repetição com novos IDs e performance limpa, legado sem agrupamento inferido.
