import { StudySet } from '../../generated/prisma/client.js';

export interface ModuleListItem extends Exclude<StudySet, 'cards'> {
  cardsCount: number;
}
