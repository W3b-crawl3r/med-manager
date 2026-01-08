package ma.foxhound.medmanager.DTO;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VisitSummaryDto {
    private Long id;
    private String summary;
    private LocalDate visitDate;
}
