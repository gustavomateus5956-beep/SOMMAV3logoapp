# Arquitetura de Dados e Camada de Repositórios — SOMMA+

Este documento descreve a transição arquitetural da camada de dados do projeto SOMMA+, saindo do acoplamento direto com o `localStorage` para o padrão Repository orientado a contratos de domínio.

---

## 1. Evolução dos Estados da Arquitetura

### Estado Inicial (Protótipo Legado)
O acesso aos dados era feito de forma síncrona e acoplada diretamente ao storage do navegador:
```
UI (Views & Modals)
      ↓
Contexts / Componentes Locais
      ↓
storageService (Monólito)
      ↓
localStorage (Navegador)
```
- **Limitações:** A interface conhecia o mecanismo de armazenamento, impedindo testes isolados, simulação de latência de rede e troca para backend real sem refatorar toda a UI.

---

### Estado Atual — Transição Segura (Etapa 3)
Inserção de contratos assíncronos (`core/repositories/`) e implementações locais intermediárias (`data/repositories/`):
```
UI (Views & Modals)
      ↓
Contexts / Domain Layer
      ↓
Repository Interface (IWorkoutRepository, IUserRepository, ICommunityRepository)
      ↓
Repository Implementation (LocalWorkoutRepository, LocalUserRepository, LocalCommunityRepository)
      ↓
storageService
      ↓
localStorage
```
- **Benefícios Imediatos:**
  - Métodos operam com assinaturas assíncronas (`Promise<T>`), antecipando o comportamento de I/O de rede.
  - Tipos e interfaces de domínio residem em `core/`, sem dependências de React, Tailwind ou APIs do browser.
  - Erros padronizados via `DataAccessError` e `EntityNotFoundError`.

---

### Estado Futuro (Produção com Backend SOMMA API)
Substituição transparente das implementações locais por clientes HTTP/WebSocket:
```
UI (Views & Modals)
      ↓
Application Services / Hooks (ex: TanStack Query / Custom Hooks)
      ↓
Repository Interface (IWorkoutRepository)
      ↓
ApiWorkoutRepository (Fetch / Axios / Interceptors)
      ↓
SOMMA API (REST / GraphQL)
      ↓
PostgreSQL / Cloud SQL
```

---

## 2. Exemplo Prático de Substituição Futura sem Quebrar a UI

Quando a API real estiver disponível, será criada a classe `ApiWorkoutRepository`:

```typescript
// src/data/repositories/ApiWorkoutRepository.ts
import { IWorkoutRepository, PreviousExercisePerformance } from '../../core/repositories/IWorkoutRepository';
import { WorkoutSessionRecord } from '../../types';
import { apiClient } from '../api/apiClient';

export class ApiWorkoutRepository implements IWorkoutRepository {
  async getWorkoutHistory(userId: string): Promise<WorkoutSessionRecord[]> {
    const response = await apiClient.get<WorkoutSessionRecord[]>(`/users/${userId}/workouts`);
    return response.data;
  }

  async saveWorkoutSession(userId: string, session: WorkoutSessionRecord): Promise<void> {
    await apiClient.post(`/users/${userId}/workouts`, session);
  }

  async getLastExercisePerformance(
    userId: string,
    exerciseName: string
  ): Promise<PreviousExercisePerformance | null> {
    const response = await apiClient.get<PreviousExercisePerformance | null>(
      `/users/${userId}/exercises/${encodeURIComponent(exerciseName)}/last-performance`
    );
    return response.data;
  }
}
```

No ponto central de injeção (`src/data/index.ts`), basta alterar a instância:

```typescript
// De:
export const repositories: AppRepositories = {
  user: new LocalUserRepository(),
  workout: new LocalWorkoutRepository(),
  community: new LocalCommunityRepository(),
};

// Para:
export const repositories: AppRepositories = {
  user: new ApiUserRepository(),
  workout: new ApiWorkoutRepository(),
  community: new ApiCommunityRepository(),
};
```

Nenhum componente da interface, modal ou context precisará ser modificado, pois todos consomem estritamente as interfaces `IWorkoutRepository`, `IUserRepository` e `ICommunityRepository`.
