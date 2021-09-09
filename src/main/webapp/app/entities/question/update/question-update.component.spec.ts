jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionService } from '../service/question.service';
import { IQuestion, Question } from '../question.model';
import { IAnnexure } from 'app/entities/annexure/annexure.model';
import { AnnexureService } from 'app/entities/annexure/service/annexure.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Component Tests', () => {
  describe('Question Management Update Component', () => {
    let comp: QuestionUpdateComponent;
    let fixture: ComponentFixture<QuestionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let questionService: QuestionService;
    let annexureService: AnnexureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuestionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      questionService = TestBed.inject(QuestionService);
      annexureService = TestBed.inject(AnnexureService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Annexure query and add missing value', () => {
        const question: IQuestion = { id: 456 };
        const annexure: IAnnexure = { id: 81408 };
        question.annexure = annexure;

        const annexureCollection: IAnnexure[] = [{ id: 49070 }];
        jest.spyOn(annexureService, 'query').mockReturnValue(of(new HttpResponse({ body: annexureCollection })));
        const additionalAnnexures = [annexure];
        const expectedCollection: IAnnexure[] = [...additionalAnnexures, ...annexureCollection];
        jest.spyOn(annexureService, 'addAnnexureToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(annexureService.query).toHaveBeenCalled();
        expect(annexureService.addAnnexureToCollectionIfMissing).toHaveBeenCalledWith(annexureCollection, ...additionalAnnexures);
        expect(comp.annexuresSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const question: IQuestion = { id: 456 };
        const annexure: IAnnexure = { id: 77183 };
        question.annexure = annexure;

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(question));
        expect(comp.annexuresSharedCollection).toContain(annexure);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Question>>();
        const question = { id: 123 };
        jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Question>>();
        const question = new Question();
        jest.spyOn(questionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(questionService.create).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Question>>();
        const question = { id: 123 };
        jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAnnexureById', () => {
        it('Should return tracked Annexure primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAnnexureById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
