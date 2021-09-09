import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnnexureComponent } from './list/annexure.component';
import { AnnexureDetailComponent } from './detail/annexure-detail.component';
import { AnnexureUpdateComponent } from './update/annexure-update.component';
import { AnnexureDeleteDialogComponent } from './delete/annexure-delete-dialog.component';
import { AnnexureRoutingModule } from './route/annexure-routing.module';

@NgModule({
  imports: [SharedModule, AnnexureRoutingModule],
  declarations: [AnnexureComponent, AnnexureDetailComponent, AnnexureUpdateComponent, AnnexureDeleteDialogComponent],
  entryComponents: [AnnexureDeleteDialogComponent],
})
export class AnnexureModule {}
