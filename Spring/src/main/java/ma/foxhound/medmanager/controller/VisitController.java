package ma.foxhound.medmanager.controller;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.VisitRequestDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/visits")
@AllArgsConstructor
public class VisitController {

    UserRepository userRepository;

    @PostMapping("/patients/{id}/addvisits")
    public ResponseEntity<String> addVisit(@PathVariable Long id, @RequestBody VisitRequestDto dto, Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof DoctorModel)) {
            return ResponseEntity.status(403).build();
        }
        DoctorModel principal = (DoctorModel) authentication.getPrincipal();
        DoctorModel doctor = (DoctorModel) userRepository.findByUsername(principal.getUsername());

        Optional<PatientModel> patientOpt = userRepository.findPatientById(id);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        PatientModel patient = patientOpt.get();

        boolean isAssigned = doctor.getPatients() != null && doctor.getPatients().stream()
                .anyMatch(p -> p.getId().equals(patient.getId()));
        if (!isAssigned) {
            return ResponseEntity.status(403).body("patient is not assigned to this doctor");
        }

        if (patient.getVisits() == null) {
            patient.setVisits(new ArrayList<>());
        }
        VisitModel visit = new VisitModel();
        visit.setSummary(dto.getSummary());
        visit.setVisitDate(dto.getVisitDate());
        patient.getVisits().add(visit);

        userRepository.save(patient);

        return ResponseEntity.status(201).body("visit added");
    }

}
