jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnnexureService } from '../service/annexure.service';
import { IAnnexure, Annexure } from '../annexure.model';

import { AnnexureUpdateComponent } from './annexure-update.component';

describe('Component Tests', () => {
  describe('Annexure Management Update Component', () => {
    let comp: AnnexureUpdateComponent;
    let fixture: ComponentFixture<AnnexureUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let annexureService: AnnexureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnnexureUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AnnexureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnnexureUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      annexureService = TestBed.inject(AnnexureService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const annexure: IAnnexure = { id: 456 };

        activatedRoute.data = of({ annexure });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(annexure));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Annexure>>();
        const annexure = { id: 123 };
        jest.spyOn(annexureService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ annexure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: annexure }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(annexureService.update).toHaveBeenCalledWith(annexure);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Annexure>>();
        const annexure = new Annexure();
        jest.spyOn(annexureService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ annexure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: annexure }));
        saveSubject.complete();

        // THEN
        expect(annexureService.create).toHaveBeenCalledWith(annexure);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Annexure>>();
        const annexure = { id: 123 };
        jest.spyOn(annexureService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ annexure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(annexureService.update).toHaveBeenCalledWith(annexure);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
