package ma.foxhound.medmanager.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.foxhound.medmanager.enums.Role;

import java.util.Collection;
import java.util.List;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class PatientModel extends UserModel {
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "patient_id")
    private List<VisitModel> visits;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.PATIENT.name());
        return java.util.Collections.singletonList(authority);
    }
    
    @JsonIgnore
    @ManyToMany(mappedBy = "patients")
    private List<DoctorModel> doctors;

}
