import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnnexureComponent } from '../list/annexure.component';
import { AnnexureDetailComponent } from '../detail/annexure-detail.component';
import { AnnexureUpdateComponent } from '../update/annexure-update.component';
import { AnnexureRoutingResolveService } from './annexure-routing-resolve.service';

const annexureRoute: Routes = [
  {
    path: '',
    component: AnnexureComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnnexureDetailComponent,
    resolve: {
      annexure: AnnexureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnnexureUpdateComponent,
    resolve: {
      annexure: AnnexureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnnexureUpdateComponent,
    resolve: {
      annexure: AnnexureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(annexureRoute)],
  exports: [RouterModule],
})
export class AnnexureRoutingModule {}
