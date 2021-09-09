import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'question',
        data: { pageTitle: 'jhipsterSampleApplicationApp.question.home.title' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'annexure',
        data: { pageTitle: 'jhipsterSampleApplicationApp.annexure.home.title' },
        loadChildren: () => import('./annexure/annexure.module').then(m => m.AnnexureModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
