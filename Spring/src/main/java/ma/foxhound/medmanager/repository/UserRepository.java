package ma.foxhound.medmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import ma.foxhound.medmanager.model.UserModel;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    UserModel findByUsername(String username); 

    @Query("SELECT p FROM PatientModel p")
    List<PatientModel> findAllPatients();

    @Query("SELECT p FROM PatientModel p WHERE p.id = ?1")
    Optional<PatientModel> findPatientById(Long id);

    @Query("SELECT p FROM PatientModel p WHERE ?1 MEMBER OF p.doctors AND LOWER(p.username) LIKE LOWER(CONCAT('%', ?2, '%'))")
    List<PatientModel> searchPatientsByKeyword(DoctorModel doctor, String keyword);
}
