import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgForm } from "@angular/forms";
import { PatientsService } from "../patients.service"
import { Patient } from "../patient"

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {

  patient: Patient;
  isLoading = false;
  private mode = "create";
  private patientId: string;

  constructor(private patientService: PatientsService,public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("patientId")) {
        this.mode = "edit";
        this.patientId = paramMap.get("patientId");
        this.isLoading = true;
        this.patientService.getPatient(this.patientId).subscribe(patientData => {
          this.isLoading = false;
          this.patient = {id: patientData._id, name: patientData.name, description: patientData.description};
          console.log(patientData);
        });
      } else {
        this.mode = "create";
        this.patientId = null;
      }
    });
  }

  addPatient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.patientService.addPatient(form.value.name, form.value.description);
    }else{
      this.patientService.updatePatient(
        this.patientId,
        form.value.name,
        form.value.description
      );
    }
    
    form.resetForm();
  }
}
