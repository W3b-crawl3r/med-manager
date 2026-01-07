package ma.foxhound.medmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.DoctorSummaryDto;
import ma.foxhound.medmanager.DTO.PatientSummaryDto;
import ma.foxhound.medmanager.DTO.VisitSummaryDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.service.SearchService;

@AllArgsConstructor
@RestController 
@RequestMapping("/api/v1/search") 
public class SearchController {

    SearchService searchService;

    @GetMapping("/doctor/{keyword}")
    public ResponseEntity<List<DoctorSummaryDto>> searchDoctors(@PathVariable String keyword) {
        List<DoctorModel> doctors = searchService.searchDoctors(keyword);
        List<DoctorSummaryDto> summaries = doctors.stream()
            .map(d -> DoctorSummaryDto.builder()
                .id(d.getId())
                .username(d.getUsername())
                .specialty(d.getSpecialty())
                .location(d.getLocation())
                .clinic(d.getClinic())
                .build())
            .collect(Collectors.toList());
        if (summaries.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/doctor/all")
    public ResponseEntity<List<DoctorSummaryDto>> getAllDoctors() {
        List<DoctorModel> doctors = searchService.getAllDoctors();
        List<DoctorSummaryDto> summaries = doctors.stream()
            .map(d -> DoctorSummaryDto.builder()
                .id(d.getId())
                .username(d.getUsername())
                .specialty(d.getSpecialty())
                .location(d.getLocation())
                .clinic(d.getClinic())
                .build())
            .collect(Collectors.toList());
        if (summaries.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/patient/{keyword}")
    public ResponseEntity<List<PatientSummaryDto>> searchPatients(@PathVariable String keyword, Authentication authentication) {
        if(!(authentication.getPrincipal() instanceof DoctorModel)) {
            return ResponseEntity.status(403).build();
        }
        DoctorModel doctor = (DoctorModel) authentication.getPrincipal();
        List<PatientModel> patients = searchService.searchPatients(doctor,keyword);
        List<PatientSummaryDto> summaries = patients.stream()
            .map(p -> PatientSummaryDto.builder()
                .id(p.getId())
                    .username(p.getUsername())
                    .visits(p.getVisits() != null ? p.getVisits().stream()
                        .map(v -> VisitSummaryDto.builder()
                            .id(v.getId())
                            .summary(v.getSummary())
                            .visitDate(v.getVisitDate())
                            .build())
                        .collect(Collectors.toList()) : null)
                    .build())
            .collect(Collectors.toList());
        if (summaries.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(summaries);
    }


    
}
