package ma.foxhound.medmanager.DTO;

import java.time.LocalDate;

import lombok.Data;

@Data
public class VisitRequestDto {
    private String summary;
    private LocalDate visitDate;
}
