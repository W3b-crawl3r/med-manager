package ma.foxhound.medmanager.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.enums.Role;
import ma.foxhound.medmanager.model.PatientModel;
import ma.foxhound.medmanager.model.UserModel;
import ma.foxhound.medmanager.repository.UserRepository;


@AllArgsConstructor
@Configuration
@Profile("h2")
public class DataInit implements CommandLineRunner {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        UserModel user = new UserModel();
        user.setUsername("admin");
        user.setHashedPassword(passwordEncoder.encode("admin123"));
        user.setRole(Role.DOCTOR);
        userRepository.save(user);
        PatientModel patient = new PatientModel();
        patient.setUsername("patient1");
        patient.setHashedPassword(passwordEncoder.encode("patient123"));
        patient.setRole(Role.PATIENT);
        userRepository.save(patient);
        
    }   
    
}
