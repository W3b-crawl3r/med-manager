package ma.foxhound.medmanager.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PatientSummaryDto {
    private Long id;
    private String username;
    private List<VisitSummaryDto> visits;
}
