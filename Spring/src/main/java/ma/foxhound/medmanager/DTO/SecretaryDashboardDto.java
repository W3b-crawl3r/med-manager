package ma.foxhound.medmanager.DTO;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SecretaryDashboardDto {
    private int totalPatients;
    private int appointmentsOnDate;
    private int pendingVisits;
    private int activePatients;
    private List<AppointmentDto> appointments;
}
