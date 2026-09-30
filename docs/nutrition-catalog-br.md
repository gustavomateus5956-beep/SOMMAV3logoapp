# SOMMA+ — Etapa Nutrição 1: catálogo brasileiro

Entrega de 28/09/2026. Catálogo local **1.0.0**, com **597 alimentos TACO em 15 categorias**, integrado somente à fundação nutricional. A POF foi obtida para auditoria e excluída da distribuição enquanto a autorização comercial das fontes compostas não estiver esclarecida.

## Base utilizada e escopo

O caminho `/mnt/data/SOMMAV3logoapp-ai-studio.zip` não existe neste ambiente Windows. Foi localizado e utilizado o ZIP de continuidade **SOMMAV3logoapp-nutricao-0.zip**, entregue pela etapa anterior, contendo o projeto `SOMMAV3logoapp-ai-studio`, `food.ts` e `SommaFoodProvider.ts`. Não se afirma identidade byte a byte com o ZIP original indisponível.

SHA-256 da base de continuidade: `ab6edeca7dc15746995ae0c86282b5595c96a0b0947da45017518961b9581306`.

A comparação por hash com essa base confirma que DietView, AddFoodModal, Treino, Muscle Map, WorkoutContext, catálogo de exercícios e demais arquivos funcionais fora da fundação nutricional foram preservados. Não há chamadas a APIs de nutrição, FatSecret, Open Food Facts ou IA. Nenhum arquivo original foi apagado.

## Fontes oficiais, versões e decisão de uso

### TACO — incluída

- Instituição: Núcleo de Estudos e Pesquisas em Alimentação, Universidade Estadual de Campinas, NEPA/UNICAMP.
- Edição: **4ª edição revisada e ampliada, Campinas, 2011**. Consulta e obtenção: 28/09/2026.
- [Página oficial de publicações](https://nepa.unicamp.br/publicacoes/).
- [Planilha oficial](https://www.nepa.unicamp.br/arquivo/uploads/taco-4a-edicao/taco-4a-edicao-2/).
- [Livro/PDF oficial e autorização de reprodução](https://www.nepa.unicamp.br/arquivo/uploads/taco-4-edicao-ampliada-e-revisada/taco_4_edicao_ampliada_e_revisada/), páginas 4–5 do PDF, ii–iii impressas.
- A autorização permite reprodução integral ou parcial mediante citação da fonte. Não há limitação comercial expressa nessa autorização. A decisão desta entrega é usar essa permissão com atribuição; não se atribui uma licença Creative Commons, MIT ou domínio público à obra.
- Atribuição preservada no manifesto e em cada registro: **NEPA/UNICAMP. Tabela Brasileira de Composição de Alimentos – TACO. 4. ed. rev. e ampl. Campinas: NEPA/UNICAMP, 2011.** Manter essa atribuição na futura interface de origem dos alimentos e na distribuição dos arquivos.
- Foram arquivados a planilha e o PDF oficiais com SHA-256 em `data-sources/nutrition/sources.json`. A URL de planilha não tem extensão, mas o arquivo recebido é XLSX. Os nomes internos das abas contêm “taco3”; eles foram mantidos como localizadores, sem reclassificar a versão anunciada pelo publicador.
- Limitações: dados históricos e representativos de amostras, por 100 g de **parte comestível**; não representam todas as marcas ou receitas atuais. Valores da planilha podem ter mais casas decimais que o PDF; foram preservados sem fabricar precisão adicional por arredondamento ou recalcular energia.

### POF/IBGE — auditada, sem redistribuição de registros

- Publicações da **POF 2008–2009, divulgadas em 2011**, consultadas em 28/09/2026. Não foram rotuladas como POF 2017–2018.
- [Tabela completa de composição, download oficial](https://ftp.ibge.gov.br/Orcamentos_Familiares/Pesquisa_de_Orcamentos_Familiares_2008_2009/Tabelas_de_Composicao_Nutricional_dos_Alimentos_Consumidos_no_Brasil/tabelacompleta.zip).
- [Livro de composição e metodologia](https://biblioteca.ibge.gov.br/visualizacao/livros/liv50002.pdf).
- [Medidas referidas estruturadas para banco de dados, download oficial](https://ftp.ibge.gov.br/Orcamentos_Familiares/Pesquisa_de_Orcamentos_Familiares_2008_2009/Tabela_de_Medidas_Referidas_para_os_Alimentos_Consumidos_no_Brasil/tabelamedidas_bd.zip).
- [Página oficial da pesquisa e publicações](https://www.ibge.gov.br/estatisticas/sociais/populacao/9050-pesquisa-de-orcamentos-familiares.html?edicao=9064&t=publicacoes).
- A disponibilidade pública não foi tratada como licença de redistribuição comercial. O livro possui copyright IBGE e descreve uma compilação de diferentes fontes. Não foi localizada, no material analisado, autorização suficiente que esclareça a redistribuição comercial de todos os valores derivados. A licença da Agência de Notícias do IBGE não foi aplicada automaticamente às tabelas.
- Na composição, 1.752 linhas apontam diretamente à referência NDSR 2008; outras 51 são de referência mista. A metodologia também registra complementações nutricionais de alimentos TACO com NDSR, portanto selecionar apenas o código de referência TACO não garante independência por nutriente.
- O [contrato oficial NDSR disponível](https://www.ncc.umn.edu/wp-content/uploads/2015/10/Research-EUA.pdf), itens 2.c, 2.g, 2.h e 2.i, exige consentimento para usos comerciais, criação de outras bases e publicação de valores individuais, além de restringir uso no desenvolvimento de websites. Ver também [licenciamento NCC](https://www.ncc.umn.edu/products/license-options/). Esse contrato não prova quais permissões específicas o IBGE obteve em 2011, nem resolve os direitos de reutilização do SOMMA+. A incerteza justifica a exclusão, não uma afirmação de que toda POF é proibida comercialmente.
- As medidas referidas incluem obras de terceiros; 5.028 linhas apontam à referência Pinheiro/Atheneu, e há 6 linhas sem código de referência. Elas têm análise de direitos própria: o contrato NDSR não é aplicado indiscriminadamente a essa tabela.
- Os arquivos POF ficaram apenas no trabalho de auditoria; **não estão no ZIP, no catálogo, no índice nem nos fixtures de teste**. O pacote contém somente URLs, hashes, contagens e a estratégia de integração. Nenhum dado foi obtido de espelhos sem procedência ou por scraping de aplicativos.

## Quantidades processadas

| Fonte | Registros auditados/processados | Identidades de alimento | Incluídos |
|---|---:|---:|---:|
| TACO, composição principal | 597 | 597 | 597 |
| TACO, tabela de ácidos graxos | 423 | 423 já presentes | enriquecimento por ID; sem novos alimentos |
| POF, composição | 1.971 combinações alimento/preparo | 1.121 códigos | 0 |
| POF, medidas | 11.801 linhas de medidas | 1.119 códigos | 0 |
| **Catálogo final** | | | **597** |

IDs TACO: `somma:taco:4:0001` a `somma:taco:4:0597`. A tabela principal e o PDF oficial terminam em 597; não foram criados registros para chegar a um número arredondado de 600.

## Normalização, valores ausentes e medidas

Os nomes mantêm espécie/tipo, corte, processamento, preparo, presença de pele/gordura e demais qualificadores da fonte. Há ajustes editoriais em PT-BR e aliases regionais conservadores, como mandioca/aipim/macaxeira, sem misturar cru e cozido. Os nomes originais ficam nos metadados e, quando distintos, nos aliases. O valor truncado “L” não é tratado como alias válido de Feijoada.

A busca ignora acentos e caixa. O índice versionado mantém texto normalizado e categoria para cada ID. O provider conserva seu mecanismo de busca em memória; o índice é um artefato validado para uso posterior, sem acrescentar dependência às telas.

Não houve deduplicação por similaridade: **0 registros removidos**, 0 grupos de nomes normalizados iguais no catálogo final. Os joins entre tabelas TACO exigem o mesmo código e nome compatível, com a correção documental indicada abaixo. Na POF auditada não há chaves duplicadas alimento/preparo na composição nem alimento/preparo/tipo de medida na tabela de medidas; isso não autoriza unir POF e TACO por nome.

`Tr`, `NA`, células vazias, `*` e valores inválidos ficam ausentes dos números e recebem, respectivamente, estados `trace`, `notApplicable`, `notAnalyzed`, `underReview` e `invalidSourceValue` na proveniência. Zero explícito válido permanece zero. Não se recalculou energia a partir dos macros e não se somaram frações para inventar gordura trans total.

**597 alimentos têm uma referência de 100 g de parte comestível; 0 têm porção de consumo e 0 têm medida caseira importada.** A referência de 100 g não é uma recomendação de consumo. Nem a TACO foi enriquecida com colheres presumidas, nem líquidos foram convertidos automaticamente: **não há suposição de 1 ml = 1 g**. Uma futura conversão de volume exigirá massa ou densidade documentada para a mesma identidade e preparo.

## Categorias

| Categoria | Alimentos |
|---|---:|
| Cereais e derivados | 63 |
| Verduras, hortaliças e derivados | 99 |
| Frutas e derivados | 96 |
| Gorduras e óleos | 14 |
| Pescados e frutos do mar | 50 |
| Carnes e derivados | 123 |
| Leite e derivados | 24 |
| Bebidas (alcoólicas e não alcoólicas) | 14 |
| Ovos e derivados | 7 |
| Produtos açucarados | 20 |
| Miscelâneas | 9 |
| Outros alimentos industrializados | 5 |
| Alimentos preparados | 32 |
| Leguminosas e derivados | 30 |
| Nozes e sementes | 11 |

## Nutrientes com valores numéricos

Todos são por 100 g. Energia em kcal; proteína, carboidratos, gorduras e fibra em g; minerais e colesterol em mg. Vitaminas seguem a unidade indicada. Os números abaixo contam somente valores disponíveis, sem imputação.

| Campo | Alimentos com valor |
|---|---:|
| calories | 591 |
| protein | 576 |
| fat | 560 |
| carbohydrates | 578 |
| fiber | 355 |
| calcium | 579 |
| iron | 554 |
| sodium | 523 |
| potassium | 582 |
| saturatedFat | 417 |
| magnesium | 577 |
| manganese | 476 |
| phosphorus | 576 |
| copper | 532 |
| zinc | 543 |
| thiamin | 392 |
| pyridoxine | 251 |
| niacin | 281 |
| riboflavin | 311 |
| vitaminC | 208 |
| cholesterol | 257 |
| retinol | 126 |
| retinolEquivalent | 176 |
| retinolActivityEquivalent | 176 |

`retinol`, `retinolEquivalent` e `retinolActivityEquivalent` são em µg e permanecem campos distintos, sem soma entre eles. Tiamina, riboflavina, piridoxina, niacina e vitamina C são em mg. `micronutrients` guarda a unidade junto a cada valor. Açúcares, gordura trans total, vitaminas D/E/B12, folato e selênio não foram inventados ou obtidos da POF. Aminoácidos e ácidos graxos individuais não fazem parte desta importação; saturados foram incorporados da segunda aba.

## Inconsistências e tratamento

- `somma:taco:4:0288`, `CMVCol taco3!I328`: valor original `-0.026666666666666172`. Campo `carbohydrates` omitido e marcado como inválido na fonte; sem substituir por zero ou adivinhar correção.
- `somma:taco:4:0322`, `CMVCol taco3!I365`: valor original `-0.04500000000000792`. Campo `carbohydrates` omitido e marcado como inválido na fonte; sem substituir por zero ou adivinhar correção.
- `somma:taco:4:0337`, `CMVCol taco3!I382`: valor original `-0.006666666666674814`. Campo `carbohydrates` omitido e marcado como inválido na fonte; sem substituir por zero ou adivinhar correção.
- `somma:taco:4:0373`, `CMVCol taco3!AA424`: valor original `,0,02`. Campo `pyridoxine` omitido e marcado como inválido na fonte; sem substituir por zero ou adivinhar correção.
- `somma:taco:4:0400`, `CMVCol taco3!I451`: valor original `-0.02333333333333809`. Campo `carbohydrates` omitido e marcado como inválido na fonte; sem substituir por zero ou adivinhar correção.
- `somma:taco:4:0540`, `CMVCol taco3!B620`: valor original `L`. Nome corrigido para **Feijoada**, confirmado no PDF oficial, página 63 (60 impressa), código 540, e na aba de ácidos graxos. O original permanece nos metadados.

Estados de ausência registrados: notApplicable: 897, notAnalyzed: 1120, trace: 1869, underReview: 66, invalidSourceValue: 5. São contagens de campos, não de alimentos.

## 20 exemplos normalizados

Os valores abaixo são apenas arredondados para apresentação; o JSON preserva os valores numéricos da planilha. Todos os exemplos têm fonte TACO/NEPA-UNICAMP 2011 e localizadores de célula no próprio registro.

| ID TACO | Nome normalizado | kcal/100 g |
|---|---|---:|
| 1 | Arroz integral cozido | 123.5 |
| 3 | Arroz branco tipo 1 cozido | 128.3 |
| 53 | Pão francês de trigo | 299.8 |
| 88 | Batata-doce cozida | 76.8 |
| 129 | Mandioca cozida | 125.4 |
| 140 | Pão de queijo assado | 363.1 |
| 182 | Banana-prata crua | 98.2 |
| 225 | Mamão formosa cru | 45.3 |
| 377 | Patinho bovino sem gordura grelhado | 219.3 |
| 410 | Peito de frango sem pele grelhado | 159.2 |
| 458 | Leite de vaca integral | Ausente na fonte |
| 461 | Queijo minas frescal | 264.3 |
| 488 | Ovo de galinha inteiro cozido por 10 minutos | 145.7 |
| 533 | Cuscuz de milho cozido com sal | 113.5 |
| 534 | Cuscuz paulista | 142.1 |
| 539 | Feijão tropeiro mineiro | 151.6 |
| 540 | Feijoada | 116.9 |
| 561 | Feijão carioca cozido | 76.4 |
| 563 | Feijão fradinho cozido | 78.0 |
| 567 | Feijão preto cozido | 77.0 |

## Integração e arquivos

`new SommaFoodProvider()` fornece os 597 registros locais. `new SommaFoodProvider([])` continua produzindo catálogo vazio, e a injeção de outros catálogos tipados permanece suportada. O provider clona dados recebidos/devolvidos e preserva busca, paginação, categoria, cancelamento e lookup por ID. A mudança de comportamento padrão é intencional; o teste da etapa 0 passou a especificar `[]` explicitamente.

Foram acrescentados campos opcionais de proveniência em `Food.metadata`: nome original, ID dos termos, checksum, localizadores e estados de nutrientes. Os modelos existentes de porção/massa/volume não foram alterados. Nenhuma tela foi conectada a esse provider nesta etapa; por isso o catálogo ainda não substitui a Dieta demonstrativa.

Criados:

- `src/data/nutrition/somma-foods-br.json`
- `src/data/nutrition/somma-foods-taxonomy.json`
- `src/data/nutrition/somma-foods-search-index.json`
- `src/data/nutrition/somma-foods-summary.json`
- `data-sources/nutrition/sources.json`, `taco-4-2011.xlsx`, `taco-4-2011.pdf`, `README.md`
- `scripts/import-somma-nutrition.py`, `requirements-nutrition.txt`, `test_import_somma_nutrition.py`
- `scripts/validate-somma-nutrition.ts`, `validate-nutrition-catalog.test.ts`
- `docs/nutrition-catalog-br.md` (este relatório)

Alterados:

- `src/features/nutrition/food.ts` — metadados opcionais de proveniência.
- `src/features/nutrition/SommaFoodProvider.ts` — catálogo padrão local.
- `scripts/validate-nutrition-foundation.test.ts` — catálogo vazio explícito.
- `package.json` — comandos de validação e testes de nutrição, sem mudar dependências.
- `docs/nutrition-foundation.md` — nota de continuidade para a etapa 1.

## Validação e reprodução

- JSONs válidos, 597 IDs únicos, categorias, índice, aliases, unidades, faixas numéricas, estados de ausência e proveniência: **aprovados**.
- Testes de nutrição: **12/12 aprovados**. Incluem busca de todos os nomes sem acentos e todos os aliases, distinção cru/cozido, prevenção de mutações, erros e cancelamento, rejeição de fontes não liberadas, unidades incorretas e medidas inventadas.
- Testes Python do importador: **3/3 aprovados**, incluindo zero versus desconhecido, preservação do preparo e rejeição de alteração no checksum da fonte.
- Regeneração `--check`: **aprovada**, sem diferença nos quatro JSONs.
- **TypeScript 7.0.2: aprovado**, sem erros.
- **Build Vite 8.3.1: aprovado**. Permanecem avisos de chunks grandes e uso de `__dirname` na configuração existente.
- Suíte geral: **45/46 testes aprovados**. A falha é o teste preexistente de 1.324 JPGs e 1.324 GIFs, porque a base recebida já não contém `public/exercises/images/` e os GIFs esperados. A listagem do ZIP original confirma zero arquivos nessas pastas. Nenhum teste foi desabilitado e nenhuma mídia ou código de Treino foi alterado para ocultar a falha. Após a última revisão editorial dos nomes, os 6 testes específicos de catálogo foram executados novamente e passaram.
- Ambiente: Node 24.19.0; dependências reutilizadas da instalação da etapa anterior, sem resolver novamente o `bun.lock`. Isso valida esta instalação, não equivale a uma instalação limpa a partir do lockfile. O sandbox Windows exige o ajuste transitório `process.geteuid=()=>0` no executor tsx para contornar `uv_os_get_passwd/ENOMEM`; esse ajuste não está no código do app.

Comandos em um ambiente normal, a partir da raiz do projeto:

```sh
python -m pip install -r scripts/requirements-nutrition.txt
python scripts/import-somma-nutrition.py --check
python scripts/test_import_somma_nutrition.py
npm run validate:nutrition
npm run test:nutrition
npm run lint
npm run build
```

Para regenerar os dados, executar o importador sem `--check`. Ele funciona offline com a cópia oficial fixada por checksum, verifica a política de redistribuição e recusa mudanças inesperadas na fonte. Não possui importação POF habilitada. Atualizar uma fonte exige nova revisão da versão, termos, estrutura e testes, seguida de alteração explícita do manifesto e da versão do catálogo.

## Estratégia compatível para a POF

Solicitar esclarecimento/autorização ao IBGE e, quando necessário, aos titulares dos dados incorporados. A autorização precisa abranger uso no produto comercial e redistribuição dos registros/valores derivados, não apenas acesso ao arquivo. Nenhuma mensagem foi enviada nesta etapa.

Após liberação, importar em namespace próprio com chave composta de versão, código de alimento e código de preparo. Preservar a referência original e a procedência por nutriente. Medidas exigem ainda o código do tipo de medida, unidade comprovada e vínculo ao mesmo alimento/preparo. Um relacionamento com TACO deve ter evidência explícita e revisão; nomes parecidos não são chave. Até lá, o SOMMA+ distribui apenas TACO e pode manter links documentais para a POF sem copiar seus registros.

## Próximos 3 passos

1. Criar o adapter e o `NutritionCatalogService`, com propagação de nutrientes desconhecidos e conversão de porções somente por massa documentada.
2. Resolver formalmente as permissões da POF e das medidas caseiras antes de qualquer nova carga; elaborar o mapeamento de identidades apenas onde houver evidência.
3. Implementar a persistência da Dieta por usuário/data com snapshots da fonte e versão do alimento, antes de ligar a biblioteca às telas.

Etapa encerrada aqui. Nenhum desses próximos passos foi executado.
