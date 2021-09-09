import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnnexureService } from '../service/annexure.service';

import { AnnexureComponent } from './annexure.component';

describe('Component Tests', () => {
  describe('Annexure Management Component', () => {
    let comp: AnnexureComponent;
    let fixture: ComponentFixture<AnnexureComponent>;
    let service: AnnexureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnnexureComponent],
      })
        .overrideTemplate(AnnexureComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnnexureComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnnexureService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.annexures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
