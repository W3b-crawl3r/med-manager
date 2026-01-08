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
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.foxhound.medmanager.DTO.AppointmentSummaryDto;
import ma.foxhound.medmanager.DTO.DoctorDashboardDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.DoctorRepository;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorDashboardController {

    private final DoctorRepository doctorRepository;

    @GetMapping("/{username}/dashboard")
    public ResponseEntity<?> getDashboard(@PathVariable String username) {
        DoctorModel doctor = doctorRepository.findByUsername(username)
            .orElse(null);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        List<PatientModel> patients = doctor.getPatients() != null ? doctor.getPatients() : new ArrayList<>();
        int totalPatients = patients.size();

        LocalDate today = LocalDate.now();

        // Flatten all visits from doctor's patients
        List<VisitModel> allVisits = patients.stream()
            .filter(p -> p.getVisits() != null)
            .flatMap(p -> p.getVisits().stream())
            .collect(Collectors.toList());

        int todaysAppointments = (int) allVisits.stream()
            .filter(v -> today.equals(v.getVisitDate()))
            .count();

        int pendingVisits = (int) allVisits.stream()
            .filter(v -> v.getVisitDate() != null && !v.getVisitDate().isBefore(today))
            .count();

        // Active patients: had a visit in last 90 days
        LocalDate cutoff = today.minusDays(90);
        int activePatients = (int) patients.stream()
            .filter(p -> p.getVisits() != null && p.getVisits().stream().anyMatch(v -> v.getVisitDate() != null && !v.getVisitDate().isBefore(cutoff)))
            .count();

        // Build appointment list for today, sorted by visitDate (no time, keep as is)
        List<AppointmentSummaryDto> appts = allVisits.stream()
            .filter(v -> today.equals(v.getVisitDate()))
            .sorted(Comparator.comparing(VisitModel::getVisitDate))
            .map(v -> {
                // Find a patient that owns this visit (since model doesn't link back)
                PatientModel owner = patients.stream()
                    .filter(p -> p.getVisits() != null && p.getVisits().contains(v))
                    .findFirst()
                    .orElse(null);
                String usernameP = owner != null ? owner.getUsername() : "Patient";
                String initial = usernameP != null && !usernameP.isEmpty() ? usernameP.substring(0, 1).toUpperCase() : "P";
                String reason = v.getSummary() != null ? v.getSummary() : "Consultation";
                String time = "—"; // No time in model
                String status = "Scheduled"; // Assume scheduled for today
                return AppointmentSummaryDto.builder()
                    .name(usernameP)
                    .initial(initial)
                    .reason(reason)
                    .time(time)
                    .status(status)
                    .build();
            })
            .collect(Collectors.toList());

        DoctorDashboardDto dto = DoctorDashboardDto.builder()
            .totalPatients(totalPatients)
            .todaysAppointments(todaysAppointments)
            .pendingVisits(pendingVisits)
            .activePatients(activePatients)
            .appointments(appts)
            .build();

        return ResponseEntity.ok(dto);
    }
}
