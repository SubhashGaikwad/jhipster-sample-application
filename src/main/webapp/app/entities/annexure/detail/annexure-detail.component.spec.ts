import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnnexureDetailComponent } from './annexure-detail.component';

describe('Component Tests', () => {
  describe('Annexure Management Detail Component', () => {
    let comp: AnnexureDetailComponent;
    let fixture: ComponentFixture<AnnexureDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AnnexureDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ annexure: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AnnexureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AnnexureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load annexure on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.annexure).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
