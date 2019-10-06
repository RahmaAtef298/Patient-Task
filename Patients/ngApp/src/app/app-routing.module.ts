import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientCreateComponent } from './patient-create/patient-create.component';


const routes: Routes = [
  { path: '', component: PatientsListComponent },
  { path: 'create', component: PatientCreateComponent },
  { path: 'list', component: PatientsListComponent },
  { path: 'edit/:patientId', component: PatientCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
