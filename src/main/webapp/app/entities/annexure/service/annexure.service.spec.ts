import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnnexure, Annexure } from '../annexure.model';

import { AnnexureService } from './annexure.service';

describe('Service Tests', () => {
  describe('Annexure Service', () => {
    let service: AnnexureService;
    let httpMock: HttpTestingController;
    let elemDefault: IAnnexure;
    let expectedResult: IAnnexure | IAnnexure[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AnnexureService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        type: 'AAAAAAA',
        compliance: false,
        comment: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Annexure', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Annexure()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Annexure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            compliance: true,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Annexure', () => {
        const patchObject = Object.assign(
          {
            type: 'BBBBBB',
            comment: 'BBBBBB',
          },
          new Annexure()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Annexure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            compliance: true,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Annexure', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAnnexureToCollectionIfMissing', () => {
        it('should add a Annexure to an empty array', () => {
          const annexure: IAnnexure = { id: 123 };
          expectedResult = service.addAnnexureToCollectionIfMissing([], annexure);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(annexure);
        });

        it('should not add a Annexure to an array that contains it', () => {
          const annexure: IAnnexure = { id: 123 };
          const annexureCollection: IAnnexure[] = [
            {
              ...annexure,
            },
            { id: 456 },
          ];
          expectedResult = service.addAnnexureToCollectionIfMissing(annexureCollection, annexure);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Annexure to an array that doesn't contain it", () => {
          const annexure: IAnnexure = { id: 123 };
          const annexureCollection: IAnnexure[] = [{ id: 456 }];
          expectedResult = service.addAnnexureToCollectionIfMissing(annexureCollection, annexure);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(annexure);
        });

        it('should add only unique Annexure to an array', () => {
          const annexureArray: IAnnexure[] = [{ id: 123 }, { id: 456 }, { id: 17152 }];
          const annexureCollection: IAnnexure[] = [{ id: 123 }];
          expectedResult = service.addAnnexureToCollectionIfMissing(annexureCollection, ...annexureArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const annexure: IAnnexure = { id: 123 };
          const annexure2: IAnnexure = { id: 456 };
          expectedResult = service.addAnnexureToCollectionIfMissing([], annexure, annexure2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(annexure);
          expect(expectedResult).toContain(annexure2);
        });

        it('should accept null and undefined values', () => {
          const annexure: IAnnexure = { id: 123 };
          expectedResult = service.addAnnexureToCollectionIfMissing([], null, annexure, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(annexure);
        });

        it('should return initial array if no Annexure is added', () => {
          const annexureCollection: IAnnexure[] = [{ id: 123 }];
          expectedResult = service.addAnnexureToCollectionIfMissing(annexureCollection, undefined, null);
          expect(expectedResult).toEqual(annexureCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
