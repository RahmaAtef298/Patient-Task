import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, from } from "rxjs";
import { map } from 'rxjs/operators';
import { Patient } from './patient';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private patients: Patient[] = [];
  private patientsUpdated = new Subject<Patient[]>();
  private patientsUrl = "http://localhost:8080/api/"

  constructor(private http : HttpClient, private router: Router) { }

  getPatients() {
    this.http
      .get<{ message: string; patients: any }>(`${this.patientsUrl}patients`)
      .pipe(map((taskData) => {
        return taskData.patients.map(patient => {
          return {
            name: patient.name,
            description: patient.description,
            id: patient._id
          };
        });
      }))
      .subscribe(returnedpatients => {
        this.patients = returnedpatients;
        this.patientsUpdated.next([...this.patients]);
      });
  }

  getPatientUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  searchPatient(name){
    this.patients=[];
    this.http
      .get<{ message: string; patients: any }>(`${this.patientsUrl}search/${name}`)
      .pipe(map((taskData) => {
        return taskData.patients.map(patient => {
          return {
            name: patient.name,
            description: patient.description,
            id: patient._id
          };
        });
      }))
      .subscribe(returnedpatients => {
        this.patients = returnedpatients;
        this.patientsUpdated.next([...this.patients]);
      });
  }

  addPatient(name: string, description: string) {
    const patient: Patient = { id: null, name: name, description: description };
    this.http
      .post<{ message: string, patientId: string }>(`${this.patientsUrl}patient`, patient)
      .subscribe(responseData => {
        const id = responseData.patientId;
        patient.id = id;
        this.patients.push(patient);
        this.patientsUpdated.next([...this.patients]);
        console.log(patient);
      });
      
  }

  deletePatient(patientId: string) {
    this.http.delete(`${this.patientsUrl}patient/`+patientId)
      .subscribe(() => {
        const updatedPatients = this.patients.filter(patient => patient.id !== patientId);
        this.patients = updatedPatients;
        this.patientsUpdated.next([...this.patients]);
      });
  }

  getPatient(patientId:string){
    return this.http
    .get<{ _id: string; name: string; description: string }>(`${this.patientsUrl}patient/`+patientId);
  }

  updatePatient(id: string, name: string, description: string) {
    const patient: Patient = { id: id, name: name, description: description };
    this.http
      .put(`${this.patientsUrl}patient/`+id, patient)
      .subscribe(response => {
        const updatedPatients = [...this.patients];
        const oldPatient = updatedPatients.findIndex(p => p.id === patient.id);
        updatedPatients[oldPatient] = patient;
        this.patients = updatedPatients;
        this.patientsUpdated.next([...this.patients]);
        this.router.navigate(["/"]);
      });
  }
}
