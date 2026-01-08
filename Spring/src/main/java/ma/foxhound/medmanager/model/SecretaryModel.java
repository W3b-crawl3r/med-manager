package ma.foxhound.medmanager.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.foxhound.medmanager.enums.Role;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class SecretaryModel extends UserModel {

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorModel doctor;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.SECRETARY.name());
        return java.util.Collections.singletonList(authority);
    }
}
