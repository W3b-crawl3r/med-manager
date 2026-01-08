package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.DoctorRegistrationDto;
import ma.foxhound.medmanager.repository.UserRepository;
import ma.foxhound.medmanager.model.DoctorModel;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/v1/doctors")
@AllArgsConstructor
public class DoctorSignupController {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody DoctorRegistrationDto request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("username and password are required");
        }

        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.status(409).body("username already exists");
        }

        DoctorModel doctor = new DoctorModel();
        doctor.setUsername(request.getUsername());
        doctor.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setEmail(request.getEmail());
        doctor.setSpecialty(request.getSpecialty());
        doctor.setPhone(request.getPhone());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setHospital(request.getHospital());
        doctor.setExperience(request.getExperience());
        
        userRepository.save(doctor);

        return ResponseEntity.status(201).body("doctor created");
    }

}
