import { FoodItem, NutritionPlan } from '../types';

export const SOLID_FOOD_DATABASE: FoodItem[] = [
  // PROTEÍNAS
  {
    id: 'food-p1',
    name: 'Peito de Frango Grelhado',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fats: 3.6,
    fiber: 0.0
  },
  {
    id: 'food-p2',
    name: 'Patinho Moído Grelhado / Cozido',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 195,
    protein: 29.5,
    carbs: 0.0,
    fats: 7.8,
    fiber: 0.0
  },
  {
    id: 'food-p3',
    name: 'Filé de Tilápia Grelhado',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 128,
    protein: 26.0,
    carbs: 0.0,
    fats: 2.7,
    fiber: 0.0
  },
  {
    id: 'food-p4',
    name: 'Filé de Salmão Grelhado',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 208,
    protein: 22.5,
    carbs: 0.0,
    fats: 13.0,
    fiber: 0.0
  },
  {
    id: 'food-p5',
    name: 'Ovo de Galinha Inteiro (Cozido ou Mexido)',
    category: 'Proteínas',
    servingSize: 50, // 1 unidade grande
    servingUnit: 'unid',
    calories: 78,
    protein: 6.5,
    carbs: 0.6,
    fats: 5.3,
    fiber: 0.0
  },
  {
    id: 'food-p6',
    name: 'Clara de Ovo Pasteurizada / Cozida',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'ml',
    calories: 48,
    protein: 10.5,
    carbs: 0.7,
    fats: 0.2,
    fiber: 0.0
  },
  {
    id: 'food-p7',
    name: 'Whey Protein Concentrado 80%',
    category: 'Suplementos',
    servingSize: 30, // 1 scoop
    servingUnit: 'g',
    calories: 122,
    protein: 24.0,
    carbs: 2.5,
    fats: 1.8,
    fiber: 0.0
  },
  {
    id: 'food-p8',
    name: 'Whey Protein Isolado 90%',
    category: 'Suplementos',
    servingSize: 30,
    servingUnit: 'g',
    calories: 110,
    protein: 27.0,
    carbs: 0.5,
    fats: 0.3,
    fiber: 0.0
  },
  {
    id: 'food-p9',
    name: 'Atum Ralado em Água',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 116,
    protein: 26.0,
    carbs: 0.0,
    fats: 0.8,
    fiber: 0.0
  },
  {
    id: 'food-p10',
    name: 'Filé Mignon Suíno Limpo',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 144,
    protein: 28.0,
    carbs: 0.0,
    fats: 3.5,
    fiber: 0.0
  },

  // CARBOIDRATOS
  {
    id: 'food-c1',
    name: 'Arroz Branco Cozido',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fats: 0.3,
    fiber: 0.4
  },
  {
    id: 'food-c2',
    name: 'Arroz Integral Cozido',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 124,
    protein: 2.6,
    carbs: 25.8,
    fats: 1.0,
    fiber: 2.7
  },
  {
    id: 'food-c3',
    name: 'Batata Doce Cozida / Assada',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fats: 0.1,
    fiber: 3.0
  },
  {
    id: 'food-c4',
    name: 'Mandioca / Aipim Cozido',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 160,
    protein: 1.4,
    carbs: 38.0,
    fats: 0.3,
    fiber: 1.8
  },
  {
    id: 'food-c5',
    name: 'Aveia em Flocos Finos',
    category: 'Carboidratos',
    servingSize: 30, // 2 colheres de sopa
    servingUnit: 'g',
    calories: 118,
    protein: 4.5,
    carbs: 20.0,
    fats: 2.2,
    fiber: 3.2
  },
  {
    id: 'food-c6',
    name: 'Pão 100% Integral Artesanal',
    category: 'Carboidratos',
    servingSize: 50, // 2 fatias
    servingUnit: 'fatia',
    calories: 124,
    protein: 5.5,
    carbs: 22.0,
    fats: 1.4,
    fiber: 4.2
  },
  {
    id: 'food-c7',
    name: 'Feijão Carioca Cozido (com caldo)',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 76,
    protein: 4.8,
    carbs: 13.6,
    fats: 0.5,
    fiber: 8.5
  },
  {
    id: 'food-c8',
    name: 'Goma de Tapioca Hidratada',
    category: 'Carboidratos',
    servingSize: 50,
    servingUnit: 'g',
    calories: 120,
    protein: 0.1,
    carbs: 29.5,
    fats: 0.0,
    fiber: 0.2
  },
  {
    id: 'food-c9',
    name: 'Macarrão de Sêmola Cozido',
    category: 'Carboidratos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 140,
    protein: 5.0,
    carbs: 28.5,
    fats: 0.8,
    fiber: 1.5
  },

  // GORDURAS BOAS
  {
    id: 'food-g1',
    name: 'Azeite de Oliva Extravirgem',
    category: 'Gorduras Boas',
    servingSize: 13, // 1 colher de sopa
    servingUnit: 'colher',
    calories: 119,
    protein: 0.0,
    carbs: 0.0,
    fats: 13.5,
    fiber: 0.0
  },
  {
    id: 'food-g2',
    name: 'Pasta de Amendoim Integral 100%',
    category: 'Gorduras Boas',
    servingSize: 15, // 1 colher de sopa
    servingUnit: 'colher',
    calories: 90,
    protein: 4.0,
    carbs: 3.0,
    fats: 7.5,
    fiber: 1.2
  },
  {
    id: 'food-g3',
    name: 'Castanha-do-Pará',
    category: 'Gorduras Boas',
    servingSize: 10, // 2 unidades
    servingUnit: 'unid',
    calories: 65,
    protein: 1.4,
    carbs: 1.2,
    fats: 6.6,
    fiber: 0.7
  },
  {
    id: 'food-g4',
    name: 'Abacate Hass / Avocado',
    category: 'Gorduras Boas',
    servingSize: 50,
    servingUnit: 'g',
    calories: 80,
    protein: 1.0,
    carbs: 4.2,
    fats: 7.3,
    fiber: 3.4
  },

  // FRUTAS & VEGETAIS
  {
    id: 'food-f1',
    name: 'Banana Prata',
    category: 'Frutas & Vegetais',
    servingSize: 100, // 1 unidade média
    servingUnit: 'unid',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fats: 0.3,
    fiber: 2.6
  },
  {
    id: 'food-f2',
    name: 'Maçã Gala com Casca',
    category: 'Frutas & Vegetais',
    servingSize: 120, // 1 unidade
    servingUnit: 'unid',
    calories: 62,
    protein: 0.3,
    carbs: 16.0,
    fats: 0.2,
    fiber: 2.9
  },
  {
    id: 'food-f3',
    name: 'Morangos Frescos',
    category: 'Frutas & Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fats: 0.3,
    fiber: 2.0
  },
  {
    id: 'food-f4',
    name: 'Brócolis Cozido no Vapor',
    category: 'Frutas & Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 35,
    protein: 2.8,
    carbs: 7.2,
    fats: 0.4,
    fiber: 3.3
  },

  // LATICÍNIOS
  {
    id: 'food-l1',
    name: 'Iogurte Grego Tradicional Zero Açúcar',
    category: 'Laticínios',
    servingSize: 100,
    servingUnit: 'g',
    calories: 59,
    protein: 10.0,
    carbs: 3.6,
    fats: 0.4,
    fiber: 0.0
  },
  {
    id: 'food-l2',
    name: 'Queijo Cottage',
    category: 'Laticínios',
    servingSize: 50, // 2 colheres de sopa
    servingUnit: 'g',
    calories: 49,
    protein: 6.2,
    carbs: 1.7,
    fats: 2.2,
    fiber: 0.0
  }
];

export const INITIAL_NUTRITION_PLAN: NutritionPlan = {
  id: 'plan-nutri-1',
  title: 'Hipertrofia Limpa & Definição Muscular',
  objective: 'Ganho de massa magra com controle rígido de percentual de gordura (2.650 kcal/dia)',
  professionalName: 'Dra. Camila Vasconcelos',
  professionalRole: 'Nutricionista Esportiva & Performance',
  professionalCremOrCrn: 'CRN-3 38921 • Certificação SOMMA Train',
  targetCalories: 2650,
  targetProtein: 185,
  targetCarbs: 280,
  targetFats: 65,
  targetFiber: 32,
  targetWaterMl: 3500,
  meals: [
    {
      id: 'meal-1',
      name: 'Café da Manhã Energético',
      time: '07:30',
      badge: 'Desjejum Anabólico',
      targetCalories: 510,
      completed: true,
      foods: [
        {
          id: 'mf-1',
          foodId: 'food-p5',
          name: 'Ovos Inteiros Mexidos',
          portion: 3,
          portionDisplay: '3 ovos inteiros',
          calories: 234,
          protein: 19.5,
          carbs: 1.8,
          fats: 15.9
        },
        {
          id: 'mf-2',
          foodId: 'food-c6',
          name: 'Pão 100% Integral Artesanal',
          portion: 2,
          portionDisplay: '2 fatias (50g)',
          calories: 124,
          protein: 5.5,
          carbs: 22.0,
          fats: 1.4
        },
        {
          id: 'mf-3',
          foodId: 'food-f1',
          name: 'Banana Prata fatiada',
          portion: 1,
          portionDisplay: '1 unidade (100g)',
          calories: 89,
          protein: 1.1,
          carbs: 22.8,
          fats: 0.3
        },
        {
          id: 'mf-4',
          foodId: 'food-c5',
          name: 'Aveia em Flocos Finos',
          portion: 1,
          portionDisplay: '20g',
          calories: 78,
          protein: 3.0,
          carbs: 13.3,
          fats: 1.5
        }
      ]
    },
    {
      id: 'meal-2',
      name: 'Lanche da Manhã / Pré-Treino',
      time: '10:30',
      badge: 'Pré-Treino',
      targetCalories: 330,
      completed: true,
      foods: [
        {
          id: 'mf-5',
          foodId: 'food-l1',
          name: 'Iogurte Grego Desnatado',
          portion: 1.5,
          portionDisplay: '150g',
          calories: 88,
          protein: 15.0,
          carbs: 5.4,
          fats: 0.6
        },
        {
          id: 'mf-6',
          foodId: 'food-p7',
          name: 'Whey Protein Concentrado',
          portion: 1,
          portionDisplay: '1 scoop (30g)',
          calories: 122,
          protein: 24.0,
          carbs: 2.5,
          fats: 1.8
        },
        {
          id: 'mf-7',
          foodId: 'food-f2',
          name: 'Maçã Gala Fresca',
          portion: 1,
          portionDisplay: '1 maçã média (120g)',
          calories: 62,
          protein: 0.3,
          carbs: 16.0,
          fats: 0.2
        }
      ]
    },
    {
      id: 'meal-3',
      name: 'Almoço Anabólico / Pós-Treino',
      time: '13:15',
      badge: 'Pós-Treino Principal',
      targetCalories: 760,
      completed: true,
      foods: [
        {
          id: 'mf-8',
          foodId: 'food-p1',
          name: 'Peito de Frango Grelhado',
          portion: 1.8,
          portionDisplay: '180g pesado pronto',
          calories: 297,
          protein: 55.8,
          carbs: 0.0,
          fats: 6.5
        },
        {
          id: 'mf-9',
          foodId: 'food-c1',
          name: 'Arroz Branco Cozido',
          portion: 2,
          portionDisplay: '200g',
          calories: 260,
          protein: 5.4,
          carbs: 56.4,
          fats: 0.6
        },
        {
          id: 'mf-10',
          foodId: 'food-c7',
          name: 'Feijão Carioca Cozido',
          portion: 1.2,
          portionDisplay: '1 concha média (120g)',
          calories: 91,
          protein: 5.8,
          carbs: 16.3,
          fats: 0.6
        },
        {
          id: 'mf-11',
          foodId: 'food-g1',
          name: 'Azeite de Oliva Extravirgem',
          portion: 1,
          portionDisplay: '1 fio (8ml)',
          calories: 73,
          protein: 0.0,
          carbs: 0.0,
          fats: 8.3
        },
        {
          id: 'mf-12',
          foodId: 'food-f4',
          name: 'Brócolis e Mix de Folhas Verdes',
          portion: 1,
          portionDisplay: '100g à vontade',
          calories: 35,
          protein: 2.8,
          carbs: 7.2,
          fats: 0.4
        }
      ]
    },
    {
      id: 'meal-4',
      name: 'Lanche da Tarde',
      time: '16:45',
      badge: 'Manutenção de Glicogênio',
      targetCalories: 360,
      completed: false,
      foods: [
        {
          id: 'mf-13',
          foodId: 'food-c6',
          name: 'Pão 100% Integral Artesanal',
          portion: 2,
          portionDisplay: '2 fatias',
          calories: 124,
          protein: 5.5,
          carbs: 22.0,
          fats: 1.4
        },
        {
          id: 'mf-14',
          foodId: 'food-p9',
          name: 'Atum Ralado em Água',
          portion: 1,
          portionDisplay: '100g escorrido',
          calories: 116,
          protein: 26.0,
          carbs: 0.0,
          fats: 0.8
        },
        {
          id: 'mf-15',
          foodId: 'food-g2',
          name: 'Pasta de Amendoim Integral',
          portion: 1,
          portionDisplay: '1 colher de sopa (15g)',
          calories: 90,
          protein: 4.0,
          carbs: 3.0,
          fats: 7.5
        }
      ]
    },
    {
      id: 'meal-5',
      name: 'Jantar Consistente',
      time: '20:15',
      badge: 'Recuperação Muscular',
      targetCalories: 510,
      completed: false,
      foods: [
        {
          id: 'mf-16',
          foodId: 'food-p2',
          name: 'Patinho Moído Magro',
          portion: 1.6,
          portionDisplay: '160g',
          calories: 312,
          protein: 47.2,
          carbs: 0.0,
          fats: 12.5
        },
        {
          id: 'mf-17',
          foodId: 'food-c3',
          name: 'Batata Doce Assada',
          portion: 1.8,
          portionDisplay: '180g',
          calories: 155,
          protein: 2.9,
          carbs: 36.2,
          fats: 0.2
        },
        {
          id: 'mf-18',
          foodId: 'food-f4',
          name: 'Legumes no Vapor (Cenoura & Vagem)',
          portion: 1,
          portionDisplay: '120g',
          calories: 45,
          protein: 1.5,
          carbs: 8.5,
          fats: 0.3
        }
      ]
    },
    {
      id: 'meal-6',
      name: 'Ceia Noturna Anti-Catabólica',
      time: '22:30',
      badge: 'Síntese Noturna',
      targetCalories: 180,
      completed: false,
      foods: [
        {
          id: 'mf-19',
          foodId: 'food-l2',
          name: 'Queijo Cottage Zero',
          portion: 2,
          portionDisplay: '100g',
          calories: 98,
          protein: 12.4,
          carbs: 3.4,
          fats: 4.4
        },
        {
          id: 'mf-20',
          foodId: 'food-g3',
          name: 'Castanha-do-Pará Selecionada',
          portion: 1,
          portionDisplay: '2 unidades (10g)',
          calories: 65,
          protein: 1.4,
          carbs: 1.2,
          fats: 6.6
        }
      ]
    }
  ],
  supplementStack: [
    {
      id: 'sup-1',
      name: 'Creatina Monohidratada 100% Creapure',
      dosage: '5g diários',
      timing: 'Pós-treino junto com carboidrato',
      taken: true
    },
    {
      id: 'sup-2',
      name: 'Whey Protein Concentrado',
      dosage: '30g (1 scoop)',
      timing: 'Pré ou pós-treino',
      taken: true
    },
    {
      id: 'sup-3',
      name: 'Ômega 3 Ultra Concentrado (EPA/DHA)',
      dosage: '2 cápsulas (1.000mg)',
      timing: 'Junto com a principal refeição (almoço)',
      taken: true
    },
    {
      id: 'sup-4',
      name: 'Multivitamínico de Alta Biodisponibilidade',
      dosage: '1 comprimido',
      timing: 'Pela manhã com o café',
      taken: true
    }
  ]
};
