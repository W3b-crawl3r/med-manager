package ma.foxhound.medmanager.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.foxhound.medmanager.DTO.AppointmentDto;
import ma.foxhound.medmanager.DTO.SecretaryDashboardDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.SecretaryModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.SecretaryRepository;

@RestController
@RequestMapping("/api/v1/secretaries")
@RequiredArgsConstructor
public class SecretaryDashboardController {

    private final SecretaryRepository secretaryRepository;

    @GetMapping("/{username}/dashboard")
    public ResponseEntity<?> getDashboard(@PathVariable String username, @RequestParam(required = false) String date) {
        SecretaryModel secretary = secretaryRepository.findByUsername(username).orElse(null);
        if (secretary == null) {
            return ResponseEntity.notFound().build();
        }

        DoctorModel doctor = secretary.getDoctor();
        if (doctor == null) {
            return ResponseEntity.status(403).body("Secretary not assigned to any doctor");
        }

        List<PatientModel> patients = doctor.getPatients() != null ? doctor.getPatients() : new ArrayList<>();
        int totalPatients = patients.size();

        LocalDate selectedDate = date != null ? LocalDate.parse(date) : LocalDate.now();

        // Flatten all visits from doctor's patients
        List<VisitModel> allVisits = patients.stream()
            .filter(p -> p.getVisits() != null)
            .flatMap(p -> p.getVisits().stream())
            .collect(Collectors.toList());

        // Appointments on selected date
        List<AppointmentDto> appointmentsOnDate = allVisits.stream()
            .filter(v -> selectedDate.equals(v.getVisitDate()))
            .sorted(Comparator.comparing(VisitModel::getVisitDate))
            .map(v -> {
                PatientModel owner = patients.stream()
                    .filter(p -> p.getVisits() != null && p.getVisits().contains(v))
                    .findFirst()
                    .orElse(null);
                String patientName = owner != null ? owner.getUsername() : "Patient";
                String reason = v.getSummary() != null ? v.getSummary() : "Consultation";
                return AppointmentDto.builder()
                    .id(v.getId())
                    .patientId(owner != null ? owner.getId() : null)
                    .patientName(patientName)
                    .date(v.getVisitDate())
                    .time("09:00") // placeholder
                    .type(reason)
                    .status("Scheduled")
                    .build();
            })
            .collect(Collectors.toList());

        int appointmentsCount = appointmentsOnDate.size();
        int pendingVisits = (int) allVisits.stream()
            .filter(v -> v.getVisitDate() != null && !v.getVisitDate().isBefore(selectedDate))
            .count();

        // Active patients: had a visit in last 90 days
        LocalDate cutoff = LocalDate.now().minusDays(90);
        int activePatients = (int) patients.stream()
            .filter(p -> p.getVisits() != null && p.getVisits().stream().anyMatch(v -> v.getVisitDate() != null && !v.getVisitDate().isBefore(cutoff)))
            .count();

        SecretaryDashboardDto dto = SecretaryDashboardDto.builder()
            .totalPatients(totalPatients)
            .appointmentsOnDate(appointmentsCount)
            .pendingVisits(pendingVisits)
            .activePatients(activePatients)
            .appointments(appointmentsOnDate)
            .build();

        return ResponseEntity.ok(dto);
    }
}
