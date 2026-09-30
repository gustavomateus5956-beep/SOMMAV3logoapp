# Auditoria anterior às alterações — Workout Engine 1

Base exclusiva: SOMMA-consolidado-nutricao2-workout-visual.zip.

- ExerciseSet mistura weight/reps executados com targetWeight/targetReps, faixa, RIR/RPE e configuração visual. Não há objeto de prescrição nem segmentos.
- SetRole usa working/warmup/top_set/backoff; SetMethod usa normal/dropset/rest_pause/amrap. Manter esses valores evita migração de UI e dados.
- WorkoutContext mantém sessão em memória, clona rotina e consulta histórico por nome/posição para preencher referência anterior. Rest Engine global continua ao minimizar.
- ActiveWorkoutModal duplica exercícios e inicialização da rotina. Sua inicialização pode substituir dados da sessão ao remontar. Edições alteram weight/reps; configuração edita role/method/faixa/RIR/RPE.
- Dois caminhos independentes salvam histórico: modal e contexto. Ambos projetam campos manualmente e perdem role/method/faixa/RIR/RPE/descanso.
- ActiveWorkoutExerciseCard lê campos planos para inputs, badges, resumo e check. Pode permanecer sem alterações visuais mediante projeção compatível.
- WorkoutView guarda rotinas em estado local com INITIAL_ROUTINES; limite Free 4 nos dois pontos de criação. Treino vazio chama onStartRoutine(null). Repetição de histórico perde configurações.
- LocalWorkoutRepository delega a storageService; histórico JSON em localStorage por usuário, sem versionamento. Leitura antiga não deve regravar registros.
- Superset/biset: activeBlocks no modal, exercícioIds e dois descansos; agrupamento e troca de ordem apenas visuais. Não há runtime nem persistência de blocos.
- Rest Engine usa descanso do exercício/fallback120, não method config. Muscle Map recebe Exercise[] e completed; preservar projeções e algoritmos.

Decisão: contratos versionados aditivos, adapters conservadores, prescrição separada antes de editar execução; um mapper de histórico usado nos dois caminhos; sem migração em massa. Contratos e ponte de blocos preparados sem substituir activeBlocks nesta etapa.
