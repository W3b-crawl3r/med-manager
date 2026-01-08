package ma.foxhound.medmanager.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.foxhound.medmanager.DTO.PatientSummaryDto;
import ma.foxhound.medmanager.DTO.VisitSummaryDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.SecretaryModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.SecretaryRepository;

@RestController
@RequestMapping("/api/v1/secretaries")
@RequiredArgsConstructor
public class SecretaryPatientController {

    private final SecretaryRepository secretaryRepository;

    @GetMapping("/{username}/patients")
    public ResponseEntity<?> getDoctorPatients(@PathVariable String username) {
        SecretaryModel secretary = secretaryRepository.findByUsername(username).orElse(null);
        if (secretary == null) {
            return ResponseEntity.notFound().build();
        }
        
        DoctorModel doctor = secretary.getDoctor();
        if (doctor == null) {
            return ResponseEntity.status(403).body("Secretary not assigned to any doctor");
        }

        List<PatientModel> patients = doctor.getPatients() != null ? doctor.getPatients() : new ArrayList<>();
        List<PatientSummaryDto> dtos = patients.stream().map(p -> PatientSummaryDto.builder()
            .id(p.getId())
            .username(p.getUsername())
            .visits(mapVisits(p.getVisits()))
            .build()).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private List<VisitSummaryDto> mapVisits(List<VisitModel> visits) {
        if (visits == null) return List.of();
        return visits.stream().map(v -> VisitSummaryDto.builder()
            .id(v.getId())
            .summary(v.getSummary())
            .visitDate(v.getVisitDate())
            .build()).collect(Collectors.toList());
    }
}
