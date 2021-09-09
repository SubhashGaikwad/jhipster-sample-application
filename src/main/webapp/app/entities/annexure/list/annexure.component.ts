import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnnexure } from '../annexure.model';
import { AnnexureService } from '../service/annexure.service';
import { AnnexureDeleteDialogComponent } from '../delete/annexure-delete-dialog.component';

@Component({
  selector: 'jhi-annexure',
  templateUrl: './annexure.component.html',
})
export class AnnexureComponent implements OnInit {
  annexures?: IAnnexure[];
  isLoading = false;

  constructor(protected annexureService: AnnexureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.annexureService.query().subscribe(
      (res: HttpResponse<IAnnexure[]>) => {
        this.isLoading = false;
        this.annexures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnnexure): number {
    return item.id!;
  }

  delete(annexure: IAnnexure): void {
    const modalRef = this.modalService.open(AnnexureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.annexure = annexure;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
