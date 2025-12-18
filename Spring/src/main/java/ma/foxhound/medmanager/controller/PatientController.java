package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.service.PatientService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/v1/patients")
@AllArgsConstructor
public class PatientController {
    
    PatientService patientService;

    @GetMapping("/getinfo/{id}")
    public ResponseEntity<PatientModel> getInfo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(patientService.getPatientsById(id));
        }
        catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    

}
