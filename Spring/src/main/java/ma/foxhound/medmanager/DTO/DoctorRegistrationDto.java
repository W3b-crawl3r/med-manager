package ma.foxhound.medmanager.DTO;

import lombok.Data;

@Data
public class DoctorRegistrationDto {
    private String username;
    private String password;
    private String email;
    private String name;
    private String specialty;
    private String phone;
    private String licenseNumber;
    private String hospital;
    private Integer experience;
}
