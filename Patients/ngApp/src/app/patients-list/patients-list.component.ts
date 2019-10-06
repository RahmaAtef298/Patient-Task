import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { Patient } from "../patient"
import { PatientsService } from "../patients.service"

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {

  patients: Patient[] = [];
  private patientsSub: Subscription;

  constructor(private patientService: PatientsService) { }

  ngOnInit() {
    this.patientService.getPatients();
    this.patientsSub = this.patientService.getPatientUpdateListener()
      .subscribe((patients: Patient[]) => {
        this.patients = patients;
      });
  }

  searchPatient(form :NgForm){
    if (form.invalid) {
      return;
    }
    this.patientService.searchPatient(form.value.name);
    form.resetForm();
  }

  deletePatient(patientId: string) {
    this.patientService.deletePatient(patientId);
  }

  ngOnDestroy() {
    this.patientsSub.unsubscribe();
  }
}
