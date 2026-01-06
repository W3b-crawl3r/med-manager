package ma.foxhound.medmanager.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.VisitModel;
import ma.foxhound.medmanager.repository.UserRepository;


@AllArgsConstructor
@Configuration
@Profile({"h2", "postgres"})
@Slf4j
public class DataInit implements CommandLineRunner {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        DoctorModel doctor = new DoctorModel();
        doctor.setUsername("admin");
        doctor.setHashedPassword(passwordEncoder.encode("admin123"));
        doctor.setSpecialty("General");
        DoctorModel doctor2 = new DoctorModel();
        doctor2.setUsername("doctor2");
        doctor2.setHashedPassword(passwordEncoder.encode("doctor123"));
        doctor2.setSpecialty("Pediatrics");
        PatientModel patient = new PatientModel();
        patient.setUsername("patient1");
        patient.setHashedPassword(passwordEncoder.encode("patient123"));
        PatientModel patient2 = new PatientModel();
        patient2.setUsername("patient2");
        patient2.setHashedPassword(passwordEncoder.encode("patient123"));
        VisitModel visit1 = new VisitModel(null, "Regular check-up. All vitals normal.", java.time.LocalDate.now().minusDays(10));
        VisitModel visit2 = new VisitModel(null, "Follow-up visit for blood test results.", java.time.LocalDate.now().minusDays(5));    
        patient.setVisits(java.util.Arrays.asList(visit1, visit2));
        doctor.getPatients().add(patient);
        doctor.getPatients().add(patient2);
        doctor2.getPatients().add(patient);
        doctor2.getPatients().add(patient2);
        userRepository.saveAll(java.util.Arrays.asList(patient, patient2, doctor, doctor2));
    }   
    
}
