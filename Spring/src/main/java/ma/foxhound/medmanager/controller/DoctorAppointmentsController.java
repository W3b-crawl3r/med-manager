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
import ma.foxhound.medmanager.DTO.AppointmentDto;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.DoctorRepository;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorAppointmentsController {

    private final DoctorRepository doctorRepository;

    @GetMapping("/{username}/appointments")
    public ResponseEntity<?> getAppointments(@PathVariable String username) {
        DoctorModel doctor = doctorRepository.findByUsername(username).orElse(null);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        List<PatientModel> patients = doctor.getPatients() != null ? doctor.getPatients() : new ArrayList<>();

        List<AppointmentDto> appointments = patients.stream()
            .flatMap(p -> {
                List<VisitModel> visits = p.getVisits();
                if (visits == null) return java.util.stream.Stream.empty();
                return visits.stream().map(v -> mapVisit(p, v));
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(appointments);
    }

    private AppointmentDto mapVisit(PatientModel patient, VisitModel visit) {
        return AppointmentDto.builder()
            .id(visit.getId())
            .patientId(patient.getId())
            .patientName(patient.getUsername())
            .date(visit.getVisitDate())
            .time("09:00") // placeholder time
            .type(visit.getSummary() != null ? visit.getSummary() : "Consultation")
            .status("Scheduled")
            .build();
    }
}
