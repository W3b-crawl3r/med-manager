package ma.foxhound.medmanager.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentSummaryDto {
    private String name;     // patient username
    private String initial;  // first letter of username
    private String reason;   // visit summary
    private String time;     // no time in model; use "—" or derived
    private String status;   // Scheduled/Confirmed
}
