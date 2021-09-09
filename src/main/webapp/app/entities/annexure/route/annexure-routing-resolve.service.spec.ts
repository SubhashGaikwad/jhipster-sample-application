jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAnnexure, Annexure } from '../annexure.model';
import { AnnexureService } from '../service/annexure.service';

import { AnnexureRoutingResolveService } from './annexure-routing-resolve.service';

describe('Service Tests', () => {
  describe('Annexure routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AnnexureRoutingResolveService;
    let service: AnnexureService;
    let resultAnnexure: IAnnexure | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AnnexureRoutingResolveService);
      service = TestBed.inject(AnnexureService);
      resultAnnexure = undefined;
    });

    describe('resolve', () => {
      it('should return IAnnexure returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnexure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnnexure).toEqual({ id: 123 });
      });

      it('should return new IAnnexure if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnexure = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAnnexure).toEqual(new Annexure());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Annexure })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnexure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnnexure).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
