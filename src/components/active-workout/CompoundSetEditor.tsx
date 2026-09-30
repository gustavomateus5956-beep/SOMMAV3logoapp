import React from 'react';
import type { ExerciseSet, Exercise, Routine } from '../../types';
import { CompoundSetExecution } from './CompoundSetExecution';

export interface CompoundSetEditorProps {
  set: ExerciseSet;
  exercise?: Exercise;
  routine?: Routine | null;
  onSave: (set: ExerciseSet) => void;
  onClose: () => void;
}

/**
 * Re-exporting CompoundSetExecution as CompoundSetEditor for backwards compatibility
 * while enforcing the clean separation of concerns:
 * - Professional/Creator prescribes the method (MethodPrescriptionSheet)
 * - Student in active workout only executes and logs (CompoundSetExecution)
 */
export function CompoundSetEditor(props: CompoundSetEditorProps) {
  return <CompoundSetExecution {...props} />;
}

export { CompoundSetExecution };
