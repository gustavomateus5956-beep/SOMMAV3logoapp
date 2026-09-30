# Auditoria anterior à implementação — Etapa 3

Base exclusiva: outputs/SOMMA-workout-engine-etapa-2.zip, extraída em work/workout-engine-3.

- ActiveWorkoutModal soma weight × reps apenas quando completed; replica o cálculo de WorkoutContext.finishWorkout. Ambos detectam PR comparando campos planos com prevWeight/prevReps.
- WorkoutContext conta exercícios/séries concluídos pelo booleano completed; progresso visual usa esses contadores. Muscle Map também conta cada objeto de série concluído (pesos musculares 1/0,5), sem usar tonelagem. Não deve receber segmentos como séries.
- SetPerformanceSegment já existe, mas não tem confirmação individual; normalizeSet conserva segmentos sem interpretá-los e projeta somente os campos da performance principal.
- MethodConfig já prescreve drops/pauses, mas não há regra que condicione completed à execução dessas etapas. Não há scheduler desses métodos.
- Histórico persiste a estrutura, porém a tela exibe só weight/reps, usa type legado para badge e desenha check até para série incompleta. Totais históricos são snapshots e não devem ser regravados/recalculados.
- ExerciseDetailModal recalcula volume por campos planos e escolhe cargas principais; precisa consumir segmentos apenas para sessões novas segmentadas, preservando cálculo legado.
- startWorkoutStructure/repeatWorkoutRoutine já limpam execução, preservando prescrição e blocos. Referências anteriores usam peso/reps planos e precisam continuar representando PRIMARY.
- activeWorkoutStorage e repository serializam JSON; contratos aceitam segmentos, mas precisam validar sua semântica adicional sem destruir histórico antigo.
- Peso corporal/sem carga: carga zero contribui zero kg de volume; o app não estima massa corporal nem carga equivalente. Repetições continuam registradas.

Decisão: conservar uma série e uma performance. Adicionar confirmação individual opcional dos segmentos e interrupção explícita; estados derivados, sem novo estado duplicado. Centralizar métricas e referência PRIMARY. Editor manual pequeno apenas em métodos compostos, sem tocar no Rest Engine ou agendar etapas. Os dados antigos continuam legíveis e os totais históricos existentes permanecem intactos.
