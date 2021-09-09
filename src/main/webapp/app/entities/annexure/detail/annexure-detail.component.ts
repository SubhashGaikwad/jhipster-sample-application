import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnnexure } from '../annexure.model';

@Component({
  selector: 'jhi-annexure-detail',
  templateUrl: './annexure-detail.component.html',
})
export class AnnexureDetailComponent implements OnInit {
  annexure: IAnnexure | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ annexure }) => {
      this.annexure = annexure;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
