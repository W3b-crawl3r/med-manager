package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.PatientSummaryDto;
import ma.foxhound.medmanager.DTO.VisitSummaryDto;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.service.PatientService;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/v1/patients")
@AllArgsConstructor
public class PatientController {
    
    PatientService patientService;

    @GetMapping("/getinfo/{id}")
    public ResponseEntity<PatientSummaryDto> getInfo(@PathVariable Long id) {
        try {
            PatientModel patient = patientService.getPatientsById(id);
            PatientSummaryDto summary = PatientSummaryDto.builder()
                .id(patient.getId())
                .username(patient.getUsername())
                .visits(patient.getVisits() != null ? patient.getVisits().stream()
                    .map(v -> VisitSummaryDto.builder()
                        .id(v.getId())
                        .summary(v.getSummary())
                        .visitDate(v.getVisitDate())
                        .build())
                    .collect(Collectors.toList()) : null)
                .build();
            return ResponseEntity.ok(summary);
        }
        catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<PatientSummaryDto> getMyInfo(Authentication authentication) {
        PatientModel patient = (PatientModel) authentication.getPrincipal();
        PatientSummaryDto summary = PatientSummaryDto.builder()
            .id(patient.getId())
            .username(patient.getUsername())
            .visits(patient.getVisits() != null ? patient.getVisits().stream()
                .map(v -> VisitSummaryDto.builder()
                    .id(v.getId())
                    .summary(v.getSummary())
                    .visitDate(v.getVisitDate())
                    .build())
                .collect(Collectors.toList()) : null)
            .build();
        return ResponseEntity.ok(summary);
    }

}
