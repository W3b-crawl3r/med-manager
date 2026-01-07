package ma.foxhound.medmanager.service;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.repository.UserRepository;

@Service
@AllArgsConstructor
public class SearchService {
    UserRepository userRepository;

    
    public java.util.List<PatientModel> searchPatients(DoctorModel doctor, String keyword) {
        return userRepository.searchPatientsByKeyword(doctor,keyword);
    }
    
    public java.util.List<DoctorModel> searchDoctors(String keyword) {
        return userRepository.searchDoctorsByKeyword(keyword);
    }

    public java.util.List<DoctorModel> getAllDoctors() {
        return userRepository.findAllDoctors();
    }
    
}
