package ma.foxhound.medmanager.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorSummaryDto {
    private Long id;
    private String username;
    private String specialty;
    private String location;
    private String clinic;
}
