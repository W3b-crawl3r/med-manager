package ma.foxhound.medmanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.foxhound.medmanager.model.DoctorModel;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorModel, Long> {
    Optional<DoctorModel> findByUsername(String username);
}
