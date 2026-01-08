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
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.DoctorRepository;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorPatientsController {

    private final DoctorRepository doctorRepository;

    @GetMapping("/{username}/patients")
    public ResponseEntity<?> getDoctorPatients(@PathVariable String username) {
        DoctorModel doctor = doctorRepository.findByUsername(username).orElse(null);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
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
