import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAnnexure, Annexure } from '../annexure.model';
import { AnnexureService } from '../service/annexure.service';

@Component({
  selector: 'jhi-annexure-update',
  templateUrl: './annexure-update.component.html',
})
export class AnnexureUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    type: [],
    compliance: [],
    comment: [],
  });

  constructor(protected annexureService: AnnexureService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ annexure }) => {
      this.updateForm(annexure);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const annexure = this.createFromForm();
    if (annexure.id !== undefined) {
      this.subscribeToSaveResponse(this.annexureService.update(annexure));
    } else {
      this.subscribeToSaveResponse(this.annexureService.create(annexure));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnnexure>>): void {
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

  protected updateForm(annexure: IAnnexure): void {
    this.editForm.patchValue({
      id: annexure.id,
      type: annexure.type,
      compliance: annexure.compliance,
      comment: annexure.comment,
    });
  }

  protected createFromForm(): IAnnexure {
    return {
      ...new Annexure(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      compliance: this.editForm.get(['compliance'])!.value,
      comment: this.editForm.get(['comment'])!.value,
    };
  }
}
