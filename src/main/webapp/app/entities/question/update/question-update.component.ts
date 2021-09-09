import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IAnnexure } from 'app/entities/annexure/annexure.model';
import { AnnexureService } from 'app/entities/annexure/service/annexure.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  annexuresSharedCollection: IAnnexure[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    subType: [],
    sno: [],
    description: [],
    annexure: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected annexureService: AnnexureService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackAnnexureById(index: number, item: IAnnexure): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      type: question.type,
      subType: question.subType,
      sno: question.sno,
      description: question.description,
      annexure: question.annexure,
    });

    this.annexuresSharedCollection = this.annexureService.addAnnexureToCollectionIfMissing(
      this.annexuresSharedCollection,
      question.annexure
    );
  }

  protected loadRelationshipsOptions(): void {
    this.annexureService
      .query()
      .pipe(map((res: HttpResponse<IAnnexure[]>) => res.body ?? []))
      .pipe(
        map((annexures: IAnnexure[]) =>
          this.annexureService.addAnnexureToCollectionIfMissing(annexures, this.editForm.get('annexure')!.value)
        )
      )
      .subscribe((annexures: IAnnexure[]) => (this.annexuresSharedCollection = annexures));
  }

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      subType: this.editForm.get(['subType'])!.value,
      sno: this.editForm.get(['sno'])!.value,
      description: this.editForm.get(['description'])!.value,
      annexure: this.editForm.get(['annexure'])!.value,
    };
  }
}
