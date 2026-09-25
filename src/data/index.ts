import { IUserRepository, IWorkoutRepository, ICommunityRepository } from '../core/repositories';
import { LocalUserRepository } from './repositories/LocalUserRepository';
import { LocalWorkoutRepository } from './repositories/LocalWorkoutRepository';
import { LocalCommunityRepository } from './repositories/LocalCommunityRepository';

export interface AppRepositories {
  user: IUserRepository;
  workout: IWorkoutRepository;
  community: ICommunityRepository;
}

/**
 * Ponto central de injeção de dependências de dados da aplicação SOMMA+.
 * Nesta fase de transição, expõe instâncias dos LocalRepositories (que encapsulam o storageService).
 * Em fases posteriores, poderá alternar para implementações de ApiRepositories conectadas ao backend real
 * sem exigir alterações nos contratos de consumo da camada de aplicação ou UI.
 */
export const repositories: AppRepositories = {
  user: new LocalUserRepository(),
  workout: new LocalWorkoutRepository(),
  community: new LocalCommunityRepository(),
};

export * from './repositories';
