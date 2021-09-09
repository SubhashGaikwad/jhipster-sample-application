import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnnexure } from '../annexure.model';
import { AnnexureService } from '../service/annexure.service';

@Component({
  templateUrl: './annexure-delete-dialog.component.html',
})
export class AnnexureDeleteDialogComponent {
  annexure?: IAnnexure;

  constructor(protected annexureService: AnnexureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.annexureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
