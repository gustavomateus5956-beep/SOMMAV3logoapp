# SOMMA+ — Etapa Nutrição 0

Nota de continuidade: este documento registra a etapa 0. Na etapa 1, o `SommaFoodProvider` passou a carregar o catálogo TACO por padrão; a injeção explícita de `[]` continua disponível. Consulte `nutrition-catalog-br.md` para dados, proveniência, licenças e validação atuais.

## 1. Arquitetura atual da Dieta

Base: SOMMAV3logoapp-ai-studio.zip, SHA-256 6C15AA1D87DC3FF37807B9919CAD1125144FEFC4743C6EA87D1313D9491A06D3. O ZIP de Downloads é idêntico ao anexo auditado anteriormente.

`App.tsx` monta/desmonta `DietView` conforme a aba. `DietView` importa `INITIAL_NUTRITION_PLAN` de `data/dietData.ts`, mantém refeições, água e suplementos em estado React e calcula os totais das refeições marcadas como concluídas. Água começa em 2450 ml; histórico semanal tem números demonstrativos. O objetivo exibido vem do usuário, podendo divergir do objetivo do plano.

`AddFoodModal` importa diretamente `SOLID_FOOD_DATABASE`, filtra nome/categoria e multiplica calorias/macros pela razão entre quantidade e servingSize. Arredonda calorias para inteiro e macros para uma casa decimal. `MealFoodEntry` registra um snapshot desses valores; `DailyMeal` agrupa entradas; `NutritionPlan` reúne metas, refeições, profissional e suplementos. Os tipos em `src/types.ts` são os usados pela UI.

Não há service/repository nutricional nem persistência da Dieta. Os repositórios existentes cobrem usuário, treino e comunidade; não foram modificados. Os tipos em `features/nutrition/types.ts` e `NutritionPlanInfoSheet` eram uma preparação parcial, sem ligação à Dieta atual.

## 2. Problemas e acoplamentos

- UI depende diretamente de catálogo e plano demonstrativos, incluindo categorias fixas.
- `servingSize` e `portion` têm semântica ambígua: gramas, ml ou quantidade de unidades. Exemplo: ovo tem servingSize=50 e servingUnit='unid'; o modal interpreta o número como base de massa, mas monta um rótulo em unidades. Não é seguro converter automaticamente todos os registros.
- Busca atual não normaliza acentos nem usa aliases.
- Micronutrientes e proveniência não acompanham as entradas atuais. Ausência de informação não pode virar zero.
- Trocar de aba reinicia o estado da Dieta; não há separação persistida por usuário e data.
- Fórmulas e arredondamento estão dentro dos componentes; alterações em refeição já concluída alteram o total consumido imediatamente.
- Progresso divide pelas metas sem validação central de metas positivas. Os dados demonstrativos atuais têm metas, mas dados futuros exigirão validação.
- O catálogo atual não comprova origem TACO/POF; nenhum registro foi promovido a dado verificado.

## 3. Arquivos criados

- `src/features/nutrition/food.ts`: modelos canônicos, contrato de provider, contratos externos e proposta de consulta futura da IA.
- `src/features/nutrition/SommaFoodProvider.ts`: provider local isolado, com catálogo injetado, busca e consulta por ID.
- `scripts/validate-nutrition-foundation.test.ts`: seis testes da fundação.
- `docs/nutrition-foundation.md`: este relatório e plano de integração.

## 4. Arquivos alterados

Somente `src/features/nutrition/types.ts`: a interface preliminar IFoodProvider passou a reexportar o contrato canônico. Não havia implementações/consumidores dessa interface no projeto. Os demais tipos preliminares permanecem disponíveis por compatibilidade. Componentes, dados atuais, tipos da UI, package.json, bun.lock e todas as áreas fora de Nutrição foram preservados.

## 5. Modelo Food

`Food` contém id, name, aliases, category opcional, brand/barcode opcionais, nutritionPer100g, portions, householdMeasures, source, externalProvider/externalId opcionais e metadata de origem/versão/verificação. Barcode é string, preservando zeros iniciais. Identidade externa é o par provider/ID, nunca o nome. Micronutrientes ficam dentro de nutritionPer100g para manter a base de cálculo explícita.

## 6. Modelo Nutrition

`Nutrition` permite calories (kcal), protein, carbohydrates, fat e fiber (g), sodium (mg), saturatedFat/transFat/sugars (g), calcium/iron/potassium/cholesterol (mg). `micronutrients` aceita identificadores adicionais, incluindo vitaminas, com valor e unidade g/mg/µg.

Todos os nutrientes são opcionais: campo ausente significa desconhecido, enquanto zero explícito significa valor informado como zero. Nenhum valor real foi criado. A UI futura deve indicar dados incompletos, sem calcular totais aparentemente completos a partir de campos ausentes. Importadores futuros deverão validar dados externos antes de criar Food; interfaces TypeScript não substituem validação de entrada.

## 7. Modelo Portion

`Portion`: id, label, amount, unit, grams opcional e milliliters opcional. A equivalência é o total correspondente a amount. Quantidades/equivalências informadas devem ser positivas e finitas. Uma porção sem massa conhecida pode ser exibida, mas não deve gerar cálculo baseado em 100 g até resolver a equivalência. Não se assume que 1 ml = 1 g.

## 8. Modelo HouseholdMeasure

`HouseholdMeasure` utiliza a mesma estrutura de Portion, restringindo a unidade a medidas como colher_sopa, colher_cha, concha, xicara, copo, unidade, fatia e pedaco. Massa/volume são específicos do alimento e da fonte; não existe tabela global inventada de equivalências.

## 9. IFoodProvider

Contrato único em `food.ts`, reexportado pelo caminho anterior: providerId, displayName, search(query, options), getById(id, signal) e getByBarcode opcional. Busca retorna items, provider, page, limit, total opcional e hasNextPage. Opções incluem categoria e AbortSignal. Não encontrado retorna null/lista vazia; falha rejeita a Promise; capacidade de barcode ausente não é confundida com produto inexistente.

## 10. SommaFoodProvider

Implementado apenas para dados locais injetados, vazio por padrão. Não importa mocks, TACO ou POF. Aceita origens locais somma/taco/pof/custom com proveniência futura. Rejeita IDs duplicados, campos essenciais vazios, valores nutricionais inválidos, porções inválidas e registros de providers externos. Busca normaliza acentos, pesquisa nomes/aliases/marcas, filtra categoria, pagina e respeita cancelamento. Entrada e resultados são copiados para evitar mutação por consumidores. Não há singleton conectado à aplicação nesta etapa.

Um importador futuro deve preparar/versionar o catálogo brasileiro e registrar procedência, licença e unidades antes da injeção. O provider não é um importador nem certifica a qualidade científica de um registro.

## 11. FatSecret

`FatSecretProviderContract` especializa IFoodProvider com identidade fatsecret. Não existe classe operacional, cliente HTTP, credencial, chamada de API ou dado desse serviço. A implementação futura deverá ocorrer com autenticação apropriada no servidor e mapeamento explícito de unidades/origem. Capacidades de restaurantes, NLP e imagens precisarão de contratos específicos quando forem implementadas; não se presume que façam parte de uma busca simples.

## 12. Open Food Facts

`OpenFoodFactsProviderContract` especializa IFoodProvider com identidade openfoodfacts. Sem implementação externa. Futuro uso complementar para produtos e barcode, mantendo proveniência, campos desconhecidos e identidade própria. Dados de fontes diferentes não devem ser mesclados silenciosamente por nome.

## 13. Consumo futuro pela Dieta e SOMMA Intelligence

Fluxo planejado: Dieta/AddFoodModal → service de catálogo nutricional → SommaFoodProvider → FatSecret (se habilitado e necessário) → Open Food Facts (se habilitado e necessário).

O service futuro recebe providers por injeção. Na primeira página, consulta o local; resultado vazio pode acionar o próximo provider. Falha não deve ser tratada como vazio: mostrar indisponibilidade ou fallback explicitamente identificado. Cancelamento encerra toda a busca. Paginação continua no provider selecionado; uma página posterior vazia não deve reiniciar a busca em outra fonte. Deduplicação usa provider/ID; barcode exige correspondência exata. Nenhuma orquestração externa foi implementada nesta etapa.

A UI futura recebe Food, resolve porção/massa, calcula nutrientes por quantidade/100 e cria snapshot da refeição com referência à origem. Preservar precisão interna e arredondar na apresentação; não recalcular registros históricos quando o catálogo mudar. Um repository nutricional futuro deve salvar registros por usuário/data e versionar a migração.

`FoodLookupProposal` prepara entradas por busca, barcode, texto, voz e fotos de produto/rótulo/prato. É apenas uma proposta de consulta com query, barcode ou referência. A IA futura consulta providers, resolve um Food e pede confirmação de alimento/quantidade quando necessário; não escreve nutrientes arbitrários diretamente no registro. Não foi implementada IA.

## 14. Compatibilidade e adapter legado

Nenhum consumidor da Dieta foi migrado. FoodItem, MealFoodEntry, DailyMeal e NutritionPlan atuais continuam intactos. O novo contrato não é atribuído diretamente aos formatos antigos. Para migração futura: carbs→carbohydrates e fats→fat; converter para 100 g somente quando a massa da base for comprovada. Dados em ml precisam de massa/densidade documentada; medidas ambíguas ficam pendentes de revisão. Preservar IDs e snapshots existentes, sem reler o catálogo para alterar refeições salvas. Adapter apenas documentado, não executado.

## 15. Riscos e limites

Persistência ausente, unidades ambíguas e origem dos dados atuais são as principais pendências nutricionais. A fundação não resolve esses problemas na interface nesta etapa. Evitar manter indefinidamente os modelos preliminares e canônicos em paralelo: migrar consumidores de modo explícito no próximo ciclo. Não há inspeção interativa do navegador nesta entrega; os arquivos da UI foram preservados e o build produziu os mesmos nomes/hash de assets da auditoria anterior.

## 16. TypeScript

PASS: executado `tsc --noEmit` pelo binário local, equivalente ao `npx tsc --noEmit`, sem diagnósticos.

## 17. Build e testes

Build PASS: executado `vite build` pelo binário local, exatamente o comando do script npm run build. Avisos preexistentes: chunks acima de 500 kB e __dirname na configuração. Bundle principal 1.195,55 kB; catálogo 4.968,95 kB, antes de gzip.

Testes: 39 PASS / 1 FAIL. Fundação nutricional 6/6; Muscle Map 9/9; descanso 10/10; catálogo de exercícios 14/15. Falha preexistente ENOENT em public/exercises/images porque o ZIP leve não contém as mídias esperadas. Nenhum teste foi removido ou relaxado.

Ambiente: Node 24.19.0; dependências instaladas anteriormente com pnpm pelas faixas do package.json, sem reconstrução exata do bun.lock. npm não está disponível no PATH. O executor tsx precisou de um shim transitório de identidade do usuário para contornar uv_os_get_passwd/ENOMEM no Windows: `node --import 'data:text/javascript,process.geteuid=()=>0' --import tsx --test scripts/validate-nutrition-foundation.test.ts scripts/validate-somma-catalog.test.ts scripts/validate-muscle-map.test.ts scripts/validate-workout-rest.test.ts`. Esse shim não altera arquivos nem lógica do app. Em ambiente normal, executar `npx tsx --test scripts/*.test.ts`.

## 18. Próximos três passos exatos

1. Revisar os alimentos legados: documentar a base em g/ml/unidade de cada registro, corrigir ambiguidades com fonte verificável e criar um adapter testado que preserve IDs e snapshots, sem inventar nutrientes.
2. Criar service de cálculo/consulta e repository nutricional por usuário/data; conectar a Dieta ao provider local por injeção, preservando o visual e verificando recarga, troca de abas, porções e totais.
3. Em uma etapa separada, preparar o catálogo brasileiro versionado com proveniência e unidades e validar sua importação local; só depois planejar integrações externas e IA.

Etapa concluída. Nenhuma importação TACO/POF, API nutricional, IA ou alteração visual realizada.
