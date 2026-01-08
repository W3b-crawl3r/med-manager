package ma.foxhound.medmanager.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.UserRepository;
import ma.foxhound.medmanager.repository.VisitRepository;

@Service
@AllArgsConstructor
public class PatientService {

    UserRepository patientRepository;
    VisitRepository visitRepository;

    public PatientModel getPatientsById(Long id) throws NoSuchElementException {
        return patientRepository.findPatientById(id).orElseThrow();
    }

    public List<VisitModel> getVisitsForPatient(PatientModel patient) {
        return visitRepository.findVisitsByPatient(patient);
    }
    
}
