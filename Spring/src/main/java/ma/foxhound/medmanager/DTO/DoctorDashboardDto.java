package ma.foxhound.medmanager.DTO;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorDashboardDto {
    private int totalPatients;
    private int todaysAppointments;
    private int pendingVisits;
    private int activePatients;
    private List<AppointmentSummaryDto> appointments;
}
