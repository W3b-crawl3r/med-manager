package ma.foxhound.medmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;

@Repository
public interface VisitRepository extends JpaRepository<VisitModel, Long> {

        @Query("SELECT v FROM PatientModel p JOIN p.visits v WHERE p = ?1")
        List<VisitModel> findVisitsByPatient(PatientModel patient);

    
}
