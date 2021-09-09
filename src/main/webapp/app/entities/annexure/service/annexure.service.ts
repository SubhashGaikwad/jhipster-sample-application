import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnexure, getAnnexureIdentifier } from '../annexure.model';

export type EntityResponseType = HttpResponse<IAnnexure>;
export type EntityArrayResponseType = HttpResponse<IAnnexure[]>;

@Injectable({ providedIn: 'root' })
export class AnnexureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/annexures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(annexure: IAnnexure): Observable<EntityResponseType> {
    return this.http.post<IAnnexure>(this.resourceUrl, annexure, { observe: 'response' });
  }

  update(annexure: IAnnexure): Observable<EntityResponseType> {
    return this.http.put<IAnnexure>(`${this.resourceUrl}/${getAnnexureIdentifier(annexure) as number}`, annexure, { observe: 'response' });
  }

  partialUpdate(annexure: IAnnexure): Observable<EntityResponseType> {
    return this.http.patch<IAnnexure>(`${this.resourceUrl}/${getAnnexureIdentifier(annexure) as number}`, annexure, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnnexure>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnnexure[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnnexureToCollectionIfMissing(annexureCollection: IAnnexure[], ...annexuresToCheck: (IAnnexure | null | undefined)[]): IAnnexure[] {
    const annexures: IAnnexure[] = annexuresToCheck.filter(isPresent);
    if (annexures.length > 0) {
      const annexureCollectionIdentifiers = annexureCollection.map(annexureItem => getAnnexureIdentifier(annexureItem)!);
      const annexuresToAdd = annexures.filter(annexureItem => {
        const annexureIdentifier = getAnnexureIdentifier(annexureItem);
        if (annexureIdentifier == null || annexureCollectionIdentifiers.includes(annexureIdentifier)) {
          return false;
        }
        annexureCollectionIdentifiers.push(annexureIdentifier);
        return true;
      });
      return [...annexuresToAdd, ...annexureCollection];
    }
    return annexureCollection;
  }
}
