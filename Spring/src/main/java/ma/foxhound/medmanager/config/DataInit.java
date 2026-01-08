package ma.foxhound.medmanager.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.foxhound.medmanager.model.DoctorModel;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.SecretaryModel;
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
        d1.setEmail("sarah.bennani@medmanager.com");
        d1.setPhone("0612345601");
        d1.setSpecialty("Cardiologist");
        d1.setLicenseNumber("MD001234");
        d1.setHospital("Heart Care Clinic");
        d1.setLocation("Casablanca");
        d1.setClinic("Heart Care Clinic");
        d1.setExperience(12);

        DoctorModel d2 = new DoctorModel();
        d2.setUsername("Dr. Youssef Amrani");
        d2.setHashedPassword(passwordEncoder.encode("pass2"));
        d2.setEmail("youssef.amrani@medmanager.com");
        d2.setPhone("0612345602");
        d2.setSpecialty("Dermatologist");
        d2.setLicenseNumber("MD001235");
        d2.setHospital("Skin Center");
        d2.setLocation("Rabat");
        d2.setClinic("Skin Center");
        d2.setExperience(8);

        DoctorModel d3 = new DoctorModel();
        d3.setUsername("Dr. Amina El Fassi");
        d3.setHashedPassword(passwordEncoder.encode("pass3"));
        d3.setEmail("amina.elfassi@medmanager.com");
        d3.setPhone("0612345603");
        d3.setSpecialty("Pediatrician");
        d3.setLicenseNumber("MD001236");
        d3.setHospital("Children's Health Center");
        d3.setLocation("Marrakech");
        d3.setClinic("Children's Health Center");
        d3.setExperience(10);

        DoctorModel d4 = new DoctorModel();
        d4.setUsername("Dr. Karim Bouzidi");
        d4.setHashedPassword(passwordEncoder.encode("pass4"));
        d4.setEmail("karim.bouzidi@medmanager.com");
        d4.setPhone("0612345604");
        d4.setSpecialty("Orthopedic Surgeon");
        d4.setLicenseNumber("MD001237");
        d4.setHospital("Bone & Joint Clinic");
        d4.setLocation("Casablanca");
        d4.setClinic("Bone & Joint Clinic");
        d4.setExperience(15);

        DoctorModel d5 = new DoctorModel();
        d5.setUsername("Dr. Fatima Zahra Alaoui");
        d5.setHashedPassword(passwordEncoder.encode("pass5"));
        d5.setEmail("fatima.alaoui@medmanager.com");
        d5.setPhone("0612345605");
        d5.setSpecialty("Neurologist");
        d5.setLicenseNumber("MD001238");
        d5.setHospital("Neuro Care Center");
        d5.setLocation("Rabat");
        d5.setClinic("Neuro Care Center");
        d5.setExperience(11);

        DoctorModel d6 = new DoctorModel();
        d6.setUsername("test");
        d6.setHashedPassword(passwordEncoder.encode("pass6"));
        d6.setEmail("test.doctor@medmanager.com");
        d6.setPhone("0612345606");
        d6.setSpecialty("Dentist");
        d6.setLicenseNumber("MD001239");
        d6.setHospital("Smile Dental Clinic");
        d6.setLocation("Tangier");
        d6.setClinic("Smile Dental Clinic");
        d6.setExperience(9);

        // Seed secretaries
        SecretaryModel s1 = new SecretaryModel();
        s1.setUsername("secretary1");
        s1.setHashedPassword(passwordEncoder.encode("secretary123"));

        SecretaryModel s2 = new SecretaryModel();
        s2.setUsername("secretary2");
        s2.setHashedPassword(passwordEncoder.encode("secretary123"));

        SecretaryModel s3 = new SecretaryModel();
        s3.setUsername("secretary3");
        s3.setHashedPassword(passwordEncoder.encode("secretary123"));
        PatientModel patient = new PatientModel();
        patient.setUsername("patient1");
        patient.setHashedPassword(passwordEncoder.encode("patient123"));

        PatientModel patient2 = new PatientModel();
        patient2.setUsername("patient2");
        patient2.setHashedPassword(passwordEncoder.encode("patient123"));

        PatientModel patient3 = new PatientModel();
        patient3.setUsername("emma.rodriguez");
        patient3.setHashedPassword(passwordEncoder.encode("patient123"));

        PatientModel patient4 = new PatientModel();
        patient4.setUsername("michael.chen");
        patient4.setHashedPassword(passwordEncoder.encode("patient123"));

        PatientModel patient5 = new PatientModel();
        patient5.setUsername("david.thompson");
        patient5.setHashedPassword(passwordEncoder.encode("patient123"));

        // Visits for patients (include some today for dashboard)
        VisitModel visit1 = new VisitModel(null, "Regular check-up. All vitals normal.", java.time.LocalDate.now().minusDays(10));
        VisitModel visit2 = new VisitModel(null, "Follow-up visit for blood test results.", java.time.LocalDate.now().minusDays(5));
        patient.setVisits(java.util.Arrays.asList(visit1, visit2));

        VisitModel p2v1 = new VisitModel(null, "Knee pain evaluation.", java.time.LocalDate.now().minusDays(2));
        VisitModel p2v2 = new VisitModel(null, "Physiotherapy session.", java.time.LocalDate.now());
        patient2.setVisits(java.util.Arrays.asList(p2v1, p2v2));

        VisitModel p3v1 = new VisitModel(null, "Dermatology follow-up.", java.time.LocalDate.now());
        VisitModel p3v2 = new VisitModel(null, "Allergy test results discussion.", java.time.LocalDate.now().plusDays(7));
        patient3.setVisits(java.util.Arrays.asList(p3v1, p3v2));

        VisitModel p4v1 = new VisitModel(null, "Cardiology consultation.", java.time.LocalDate.now());
        patient4.setVisits(java.util.Arrays.asList(p4v1));

        VisitModel p5v1 = new VisitModel(null, "General consultation.", java.time.LocalDate.now().minusDays(1));
        VisitModel p5v2 = new VisitModel(null, "Blood pressure check.", java.time.LocalDate.now());
        patient5.setVisits(java.util.Arrays.asList(p5v1, p5v2));

        // Link patients to many doctors
        d1.getPatients().add(patient);
        d1.getPatients().add(patient2);
        d1.getPatients().add(patient3);
        d1.getPatients().add(patient4);

        d2.getPatients().add(patient);
        d2.getPatients().add(patient2);
        d2.getPatients().add(patient3);

        d3.getPatients().add(patient);
        d3.getPatients().add(patient4);

        d4.getPatients().add(patient2);
        d4.getPatients().add(patient5);

        d5.getPatients().add(patient3);
        d5.getPatients().add(patient5);

        d6.getPatients().add(patient4);
        userRepository.saveAll(java.util.Arrays.asList(
            patient, patient2, patient3, patient4, patient5,
            d1, d2, d3, d4, d5, d6,
            s1, s2, s3
        ));
    }   
    
}
