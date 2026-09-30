# SOMMA+ — Etapa Nutrição 2

Adapter + NutritionCatalogService. Entrega em 29/09/2026, a partir de `SOMMAV3logoapp-nutricao-1.zip`.

**Concluído:** o AddFoodModal usa o serviço local e pesquisa os 597 alimentos TACO. Há cálculo por massa com precisão interna, adapter explícito para a UI e snapshots históricos independentes. O layout foi preservado. Não há nova persistência nem integração externa.

## 1. Auditoria da Dieta atual

| Elemento | Situação encontrada | Tratamento nesta etapa |
|---|---|---|
| `DietView` | Plano demonstrativo em estado React, somas diretas de valores obrigatórios; só refeições concluídas entram nos totais do dia | Mesma estrutura e comportamento; somas passam a preservar desconhecidos e ler snapshots das novas entradas |
| `AddFoodModal` | Importação direta de `SOLID_FOOD_DATABASE`, filtro local simples e cálculo com arredondamento antes de montar a entrada | Migração para serviço, adapter, paginação e cancelamento |
| `FoodItem` | Macros e fibra obrigatórios, seis categorias antigas; `servingSize` podia significar gramas ou ml | Tipo legado preservado; novo `CatalogFoodItem` admite campos ausentes e os nomes das categorias TACO |
| `MealFoodEntry` | `portion` mistura massa, unidades e frações; `portionDisplay` era a única pista de unidade | Macros passam a opcionais, `portionUnit?: 'g'` e `snapshot?` são adicionados; novos registros usam massa explícita |
| `DailyMeal` | Lista de alimentos, meta calórica, horário e marcação de conclusão | Estrutura preservada |
| `NutritionPlan` | Metas, refeições, água e suplementos demonstrativos | Estrutura, metas e conteúdo inicial preservados |
| `features/nutrition/types.ts` | Contratos anteriores com nutrientes obrigatórios e outras convenções de unidades | Preservados para compatibilidade; o novo serviço utiliza `Food`/`Nutrition` de `food.ts` |

`src/data/dietData.ts` não foi alterado. Os alimentos já registrados nas refeições continuam com seus IDs, nomes, porções e valores anteriores; nenhum foi remapeado por similaridade para TACO. A base `SOLID_FOOD_DATABASE` permanece no projeto por compatibilidade, mas não é mais importada pelo modal. Dados demonstrativos de água, semana e suplementos permanecem como estavam.

## 2. Arquivos criados

- `src/features/nutrition/NutritionCatalogService.ts`
- `src/features/nutrition/legacyFoodAdapter.ts`
- `src/features/nutrition/nutritionCalculation.ts`
- `src/features/nutrition/nutritionSnapshot.ts`
- `scripts/validate-nutrition-service.test.ts`
- `docs/nutrition-service.md` — este relatório.

Entregáveis externos ao projeto: ZIP atualizado, este relatório em Markdown e captura de verificação do modal.

## 3. Arquivos alterados

- `src/components/AddFoodModal.tsx` — serviço, adapter, busca paginada, cancelamento, cálculo e confirmação com snapshot.
- `src/components/DietView.tsx` — somente cálculo e apresentação segura de valores desconhecidos; mesmas classes, blocos, cores e organização.
- `src/types.ts` — apenas importação de tipo e extensão nutricional de `MealFoodEntry`; nenhum modelo de Treino foi alterado.
- `package.json` — inclusão do teste do serviço no comando `test:nutrition`, sem novas dependências.

Os quatro JSONs nutricionais, o `SommaFoodProvider`, as fontes oficiais e seus termos permanecem iguais aos da Etapa 1. A comparação byte a byte com o ZIP anterior limita as alterações originais aos quatro arquivos acima. Treino, Muscle Map, descanso, WorkoutContext, catálogo de exercícios, Home, Pass e Perfil não foram editados.

## 4. Estrutura do adapter

```text
Food canônico / Nutrition
  → toLegacyFoodItem / toLegacyMacros
  → campos apresentados pelo AddFoodModal

NutritionSnapshot
  → toMealFoodEntry
  → MealFoodEntry consumido pela Dieta
```

Mapeamentos explícitos: `carbohydrates → carbs`, `fat → fats`; `calories`, `protein` e `fiber` mantêm seu significado. Não há preenchimento por zero, estimativa ou consulta a outra base. `CatalogFoodItem` é uma projeção compatível com o formato da UI, mas não força a assinatura obrigatória de todos os nutrientes do antigo `FoodItem`.

`toLegacyFoodItem(food)` apresenta uma base fixa de 100 g, categoria da taxonomia oficial e números arredondados apenas para exibição. O registro canônico selecionado é mantido separado: cálculos nunca usam essa projeção já arredondada como fonte.

`toMealFoodEntry(snapshot, id?)` cria um ID de instância com UUID, grava `foodId`, nome, massa, `portionUnit: 'g'`, texto da quantidade, projeção dos macros e uma cópia imutável do snapshot. IDs da refeição não são confundidos com IDs de catálogo.

Funções auxiliares: `roundNutrient`, `displayNutrient`, `sumMealNutrition`, `nutrientPercent` e `remainingNutrient`. Totais de novas entradas usam os nutrientes exatos do snapshot; entradas antigas continuam usando os números já armazenados.

## 5. API pública do NutritionCatalogService

| API | Comportamento |
|---|---|
| `new NutritionCatalogService()` | Usa `SommaFoodProvider` e versão 1.0.0 do catálogo entregue |
| `new NutritionCatalogService({ provider, catalogVersion })` | Injeção explícita de provider local versionado para testes ou evolução controlada; providers externos são recusados |
| `catalogVersion` | Versão vinculada aos snapshots |
| `getCategories()` | Cópia das 15 categorias da taxonomia |
| `search(query, { category?, page?, limit?, signal? })` | Nome, aliases, busca sem acentos, categoria por ID, total e indicação de próxima página |
| `getById(foodId, signal?)` | Registro canônico independente ou `null` |
| `calculateForFood(food, quantity)` | Prévia síncrona a partir do registro selecionado, sem arredondamento |
| `calculate(foodId, quantity, signal?)` | Lookup e cálculo; ID inexistente gera erro |
| `createSnapshot(foodId, quantity, signal?)` | Lookup, cálculo e cópia histórica profundamente congelada |

`quantity = { amount: number, unit: PortionUnit, portionId?: string }`.

Exemplo:

```ts
const service = new NutritionCatalogService();
const result = await service.search('feijao preto', { page: 1, limit: 30, signal });
const snapshot = await service.createSnapshot(
  'somma:taco:4:0003', { amount: 150, unit: 'g' }, signal
);
const entry = toMealFoodEntry(snapshot);
```

Falhas de cálculo, ID inexistente e fontes não habilitadas rejeitam explicitamente. O cancelamento é conferido antes e depois das operações aguardadas. Não há fallback externo. A quantidade é copiada antes do lookup assíncrono para impedir que alterações no objeto do chamador modifiquem um cálculo em andamento.

## 6. Como os 597 alimentos entram na busca

`AddFoodModal → NutritionCatalogService → SommaFoodProvider → somma-foods-br.json`.

O serviço padrão compartilha uma instância local e recebe os mesmos 597 registros da Etapa 1. O provider mantém a busca por termos nos nomes/aliases, ignorando acentos e caixa, e a filtragem pela categoria. O modal busca **30 itens por página** e oferece “Carregar mais” na lista existente. Mudar texto/categoria limpa a lista e volta à primeira página, cancelando a consulta anterior; desmontar o modal cancela operações pendentes.

As categorias demonstrativas antigas foram substituídas pelas 15 categorias reais da TACO, nos mesmos botões horizontais. Isso evita classificar pratos mistos como proteína/carboidrato por suposição. “Todos”, seleção, pesquisa e escolha de alimento mantêm seu fluxo. A paginação não limita o universo: todos os 597 registros continuam acessíveis.

Há estados de carregamento, nenhum resultado e erro com tentativa novamente. Os aliases funcionam, por exemplo, `macaxeira cozida → Mandioca cozida`. Nenhum alimento mock é acrescentado aos resultados. O índice e os dados versionados da Etapa 1 não foram reescritos.

## 7. Cálculo por quantidade e medidas

Para cada nutriente numérico disponível: `valor calculado = valor por 100 g × (gramas / 100)`.

Exemplo sintético de teste: 128 kcal/100 g × 150/100 = **192 kcal**. No arroz branco tipo 1 real, 128,258485666… kcal/100 g × 1,5 = 192,387728499… kcal internas; a tela mostra **192 kcal**. O snapshot guarda a precisão interna de números JavaScript e não o número arredondado da tela.

Micronutrientes usam a mesma escala, mantendo suas unidades `g`, `mg` ou `µg`. Energia é apresentada sem casas e macros com até uma casa; a quantidade em gramas continua explícita e não é truncada pelo adapter. Não há cálculo de calorias a partir dos macros.

São recusados quantidade zero, negativa, NaN, infinita, resultado infinito e nutriente numericamente inválido. Para unidades diferentes de g, é obrigatório indicar `portionId` de uma única porção daquele alimento, com unidade correspondente, `grams` e `amount` positivos documentados. A fórmula é `quantidade solicitada / quantidade da porção × massa da porção`.

Exemplo estrutural de teste: uma porção documentada de duas fatias com 60 g permite três fatias = 90 g. Esse exemplo não é um alimento real acrescentado à base. Somente ml sem massa, unidade/colher/concha/xícara/fatia sem equivalência ou uma porção de outro alimento são recusados. **1 ml nunca é tratado como 1 g.**

A TACO entregue continua sem medidas caseiras de consumo liberadas. Por isso o modal oferece apenas gramas e os atalhos de 50/100/150/200 g já existentes, sem inventar colheres, fatias ou unidades. O suporte contratual a equivalências documentadas está testado, mas não injeta equivalências fictícias no catálogo.

## 8. Campos desconhecidos

Um campo ausente permanece `undefined`/ausente no cálculo, na projeção e no snapshot. Ao serializar para JSON, ele continua ausente. Zero explícito da fonte permanece zero. Os estados originais de proveniência, como traço ou análise em revisão, são conservados nos metadados.

A apresentação usa **“—”**, com explicação em tooltip. Se um alimento consumido não informa determinado macro ou calorias, **somente o total daquele nutriente fica indisponível**; não se exibe a soma parcial como total completo. O restante calórico e a barra correspondente também ficam indisponíveis quando não há valor confiável. Os números conhecidos dos demais nutrientes continuam funcionando. Uma refeição vazia soma zero, pois representa ausência de consumo, não ausência de informação nutricional.

## 9. Snapshot histórico

`NutritionSnapshot` contém:

- `schemaVersion`, `foodId`, provider local e fonte original;
- versão do catálogo, data/hora da captura e nome apresentado;
- categoria, quantidade e unidade solicitadas, massa calculada;
- referência de porção, quando utilizada;
- nutrientes por 100 g e nutrientes calculados, incluindo micronutrientes e suas unidades;
- metadados completos de origem, versão da fonte, checksum, localizadores e estados disponíveis no registro.

O snapshot não contém referências mutáveis ao catálogo: usa `structuredClone`, tipos recursivamente readonly e `Object.freeze` recursivo. O adapter faz outra cópia independente ao anexá-lo à refeição. Alterar nome, nutrientes ou metadados do provider posteriormente não muda uma refeição já criada. A Dieta não consulta o catálogo para recalcular snapshots históricos.

O formato é serializável, mas **não há repository, escrita por usuário/data ou armazenamento nutricional novo**. Em uma etapa futura, dados desserializados deverão ser validados por `schemaVersion` e novamente tratados como valores independentes; JSON não preserva `Object.freeze` sozinho. Nesta entrega, refeições novas continuam somente no estado React e desaparecem ao recarregar/desmontar a Dieta, como antes.

## 10. AddFoodModal e compatibilidade

**Migrado.** Selecionar alimento mantém a mesma tela de porção, atalhos, chips de macros e ações. A confirmação usa o serviço para criar o snapshot antes de chamar `onAddFood`. Há bloqueio de quantidade inválida e submissão duplicada durante a criação; fechar o modal cancela a confirmação pendente. A referência TACO/NEPA–UNICAMP (2011) é exibida na linha já existente de origem/base.

Incompatibilidades tratadas: nutrientes antes obrigatórios, seis categorias mock sem correspondência exata com as 15 categorias TACO, ambiguidade de `servingSize/portion`, somas que gerariam NaN com campos ausentes e IDs por milissegundo que poderiam colidir. As porções históricas não foram reinterpretadas, e alimentos antigos não foram convertidos a TACO por nome.

## 11. Testes

**24/24 testes de nutrição PASS**, sendo 12 novos testes do serviço/adapter e 12 testes preservados das etapas anteriores. Cobertura: 597 IDs por paginação, busca sem acento e aliases, categorias, lookup, cálculo por massa, micronutrientes, ausência versus zero, arredondamento somente na projeção, rejeição de medidas ambíguas, snapshot profundo e independente, cancelamento antes/depois de await, captura da quantidade em andamento, refeições antigas e contrato do modal.

**Verificação interativa no navegador PASS:** paginação de 30 para 60 alimentos; pesquisa sem acentos; alias macaxeira; filtro combinado por categoria e estado vazio; quantidade zero bloqueada; 150 g de arroz adicionados com 192 kcal; alimento com dados ausentes propagado como “—” até os totais; remoção restaurando os totais; recarga restaurando o plano inicial, confirmando ausência de persistência nova. Captura final: `NUTRICAO-2-modal.png`.

**Suíte completa: 57/58 PASS.** A única falha é o teste preexistente que exige 1.324 JPGs e 1.324 GIFs de exercícios ausentes desde a base anterior (`public/exercises/images/`). Essa falha não é atribuída à Etapa 2 e não foi ocultada, desabilitada nem corrigida alterando Treino.

## 12. TypeScript

**PASS**, TypeScript 7.0.2, sem erros.

O ambiente não disponibiliza `npx`/`npm` no PATH. Foi executado diretamente o mesmo compilador instalado: `node node_modules/typescript/bin/tsc --noEmit`, equivalente a `npx tsc --noEmit` com essa instalação. Não se afirma que o wrapper npx foi executado.

## 13. Build

**PASS**, Vite 8.3.1. Executado `node node_modules/vite/bin/vite.js build`, o comando efetivo do script `npm run build`.

Permanecem os avisos de `__dirname` na configuração e chunks maiores que 500 kB. O catálogo agora alcança a UI e aumenta o JS principal de aproximadamente 1,20 MB para 2,67 MB antes de gzip (cerca de 461 kB com gzip); isso é uma limitação de carregamento a considerar na próxima otimização. Não houve alteração das dependências nem reconstrução do lockfile. Foi reutilizada a instalação da etapa anterior; este teste não equivale a instalação limpa pelo `bun.lock`.

O runner de testes tsx exigiu o ajuste transitório já utilizado neste Windows: `node --import 'data:text/javascript,process.geteuid=()=>0' --import tsx --test scripts/*.test.ts`. Ele contorna a consulta de identidade do sistema no sandbox e não integra o aplicativo entregue. Em ambiente normal:

```sh
npm run test:nutrition
npm run validate:nutrition
npx tsc --noEmit
npm run build
```

## 14. Próximos 3 passos

1. Implementar repository nutricional por usuário/data, persistindo o snapshot validado e mantendo os dados legados identificados como legados.
2. Implementar leitura/edição do histórico com testes de atualização de catálogo, sem recalcular refeições antigas automaticamente.
3. Otimizar o carregamento local do catálogo sob demanda e preparar a biblioteca futura; porções e novas fontes só devem entrar com equivalências e permissões documentadas.

Nenhum desses passos foi executado. Não foram integrados POF, FatSecret, Open Food Facts, IA, foto, barcode ou voz. A Etapa 2 termina nesta entrega.
