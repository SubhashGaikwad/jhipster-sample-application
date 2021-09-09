import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnnexure, Annexure } from '../annexure.model';
import { AnnexureService } from '../service/annexure.service';

@Injectable({ providedIn: 'root' })
export class AnnexureRoutingResolveService implements Resolve<IAnnexure> {
  constructor(protected service: AnnexureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnnexure> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((annexure: HttpResponse<Annexure>) => {
          if (annexure.body) {
            return of(annexure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Annexure());
  }
}
