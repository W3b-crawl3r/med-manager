package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.LoginRequestDto;
import ma.foxhound.medmanager.repository.UserRepository;
import ma.foxhound.medmanager.model.PatientModel;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/v1/patients")
@AllArgsConstructor
public class PatientSignupController {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody LoginRequestDto request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "username and password are required"));
        }

        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.status(409).body(java.util.Map.of("error", "username already exists"));
        }

        PatientModel patient = new PatientModel();
        patient.setUsername(request.getUsername());
        patient.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(patient);

        return ResponseEntity.status(201).body(java.util.Map.of("message", "patient created", "username", request.getUsername()));
    }

}
