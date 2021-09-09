import { IQuestion } from 'app/entities/question/question.model';

export interface IAnnexure {
  id?: number;
  type?: string | null;
  compliance?: boolean | null;
  comment?: string | null;
  questions?: IQuestion[] | null;
}

export class Annexure implements IAnnexure {
  constructor(
    public id?: number,
    public type?: string | null,
    public compliance?: boolean | null,
    public comment?: string | null,
    public questions?: IQuestion[] | null
  ) {
    this.compliance = this.compliance ?? false;
  }
}

export function getAnnexureIdentifier(annexure: IAnnexure): number | undefined {
  return annexure.id;
}
