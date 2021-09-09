import { IAnnexure } from 'app/entities/annexure/annexure.model';

export interface IQuestion {
  id?: number;
  type?: string | null;
  subType?: string | null;
  sno?: number | null;
  description?: string | null;
  annexure?: IAnnexure | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public type?: string | null,
    public subType?: string | null,
    public sno?: number | null,
    public description?: string | null,
    public annexure?: IAnnexure | null
  ) {}
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
