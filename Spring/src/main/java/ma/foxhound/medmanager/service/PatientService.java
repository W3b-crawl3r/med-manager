package ma.foxhound.medmanager.service;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.repository.UserRepository;

@Service

public class PatientService {
    @Autowired
    UserRepository patientRepository;

    public PatientModel getPatientsById(Long id) throws NoSuchElementException {
        return patientRepository.findPatientById(id).orElseThrow();
    }
    
}
