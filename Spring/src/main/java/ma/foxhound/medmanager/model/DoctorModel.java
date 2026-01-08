package ma.foxhound.medmanager.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.foxhound.medmanager.enums.Role;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class DoctorModel extends UserModel {
    String specialty;
    String location;
    String clinic;
    String email;
    String phone;
    String licenseNumber;
    String hospital;
    Integer experience;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.DOCTOR.name());
        return java.util.Collections.singletonList(authority);
    }
    
    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<PatientModel> patients = new ArrayList<>();

    @jakarta.persistence.OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SecretaryModel> secretaries = new ArrayList<>();
}
