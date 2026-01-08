package ma.foxhound.medmanager.DTO;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private LocalDate date;
    private String time; // not stored; placeholder or derived
    private String type;
    private String status; // Scheduled/Confirmed/Cancelled
}
