package ma.foxhound.medmanager.DTO;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}
