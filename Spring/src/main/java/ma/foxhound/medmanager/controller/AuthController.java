package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.LoginRequestDto;
import ma.foxhound.medmanager.DTO.TokenDto;
import ma.foxhound.medmanager.enums.Role;
import ma.foxhound.medmanager.service.AuthService;
import ma.foxhound.medmanager.service.PatientService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;


@AllArgsConstructor
@RestController // this is to mark it for spring as a rest api controller
@RequestMapping("/api/v1/auth") // this is to define the base url for this controller
public class AuthController {

    
    AuthService authService;
    PatientService patientService;
    
    @PostMapping("/login") // this is to define the endpoint for POST requests so it is accessible at api/v1/auth/login
    public ResponseEntity<TokenDto> postMethodName(@RequestBody LoginRequestDto loginRequest) {
       String token = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
         TokenDto dto = TokenDto.builder().token(token).build();
        return ResponseEntity.ok().body(dto);
    }

    @PostMapping("/login-doctor")
    public ResponseEntity<TokenDto> loginDoctor(@RequestBody LoginRequestDto loginRequest) {
        try {
            String token = authService.loginWithRole(loginRequest.getUsername(), loginRequest.getPassword(), Role.DOCTOR);
            TokenDto dto = TokenDto.builder().token(token).build();
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("/login-patient")
    public ResponseEntity<TokenDto> loginPatient(@RequestBody LoginRequestDto loginRequest) {
        try {
            String token = authService.loginWithRole(loginRequest.getUsername(), loginRequest.getPassword(), Role.PATIENT);
            TokenDto dto = TokenDto.builder().token(token).build();
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("/login-secretary")
    public ResponseEntity<TokenDto> loginSecretary(@RequestBody LoginRequestDto loginRequest) {
        try {
            String token = authService.loginWithRole(loginRequest.getUsername(), loginRequest.getPassword(), Role.SECRETARY);
            TokenDto dto = TokenDto.builder().token(token).build();
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(403).build();
        }
    }
    
    @GetMapping("/appointments")
    public String authtest() {
        return new String("Hello World");
    }

    
    
}
