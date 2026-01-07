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
        // Seed doctors (matching Angular mock data)
        DoctorModel d1 = new DoctorModel();
        d1.setUsername("Dr. Sarah Bennani");
        d1.setHashedPassword(passwordEncoder.encode("pass1"));
        d1.setSpecialty("Cardiologist");
        d1.setLocation("Casablanca");
        d1.setClinic("Heart Care Clinic");

        DoctorModel d2 = new DoctorModel();
        d2.setUsername("Dr. Youssef Amrani");
        d2.setHashedPassword(passwordEncoder.encode("pass2"));
        d2.setSpecialty("Dermatologist");
        d2.setLocation("Rabat");
        d2.setClinic("Skin Center");

        DoctorModel d3 = new DoctorModel();
        d3.setUsername("Dr. Amina El Fassi");
        d3.setHashedPassword(passwordEncoder.encode("pass3"));
        d3.setSpecialty("Pediatrician");
        d3.setLocation("Marrakech");
        d3.setClinic("Children's Health Center");

        DoctorModel d4 = new DoctorModel();
        d4.setUsername("Dr. Karim Bouzidi");
        d4.setHashedPassword(passwordEncoder.encode("pass4"));
        d4.setSpecialty("Orthopedic Surgeon");
        d4.setLocation("Casablanca");
        d4.setClinic("Bone & Joint Clinic");

        DoctorModel d5 = new DoctorModel();
        d5.setUsername("Dr. Fatima Zahra Alaoui");
        d5.setHashedPassword(passwordEncoder.encode("pass5"));
        d5.setSpecialty("Neurologist");
        d5.setLocation("Rabat");
        d5.setClinic("Neuro Care Center");

        DoctorModel d6 = new DoctorModel();
        d6.setUsername("Dr. Mehdi Benjelloun");
        d6.setHashedPassword(passwordEncoder.encode("pass6"));
        d6.setSpecialty("Dentist");
        d6.setLocation("Tangier");
        d6.setClinic("Smile Dental Clinic");
        PatientModel patient = new PatientModel();
        patient.setUsername("patient1");
        patient.setHashedPassword(passwordEncoder.encode("patient123"));
        PatientModel patient2 = new PatientModel();
        patient2.setUsername("patient2");
        patient2.setHashedPassword(passwordEncoder.encode("patient123"));
        VisitModel visit1 = new VisitModel(null, "Regular check-up. All vitals normal.", java.time.LocalDate.now().minusDays(10));
        VisitModel visit2 = new VisitModel(null, "Follow-up visit for blood test results.", java.time.LocalDate.now().minusDays(5));    
        patient.setVisits(java.util.Arrays.asList(visit1, visit2));
        d1.getPatients().add(patient);
        d1.getPatients().add(patient2);
        d2.getPatients().add(patient);
        d2.getPatients().add(patient2);
        userRepository.saveAll(java.util.Arrays.asList(patient, patient2, d1, d2, d3, d4, d5, d6));
    }   
    
}
