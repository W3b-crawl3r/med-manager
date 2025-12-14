package ma.foxhound.medmanager.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.DTO.LoginRequestDto;
import ma.foxhound.medmanager.DTO.TokenDto;
import ma.foxhound.medmanager.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;


@AllArgsConstructor
@RestController // this is to mark it for spring as a rest api controller
@RequestMapping("/api/v1/auth") // this is to define the base url for this controller
public class AuthController {

    
    AuthService authService;
    
    @PostMapping("/login") // this is to define the endpoint for POST requests so it is accessible at api/v1/auth/login
    public ResponseEntity<TokenDto> postMethodName(@RequestBody LoginRequestDto loginRequest) {
       String token = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
         TokenDto dto = TokenDto.builder().token(token).build();
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping("/test")
    public String test() {
        return new String("Hello World");
    }
    
    @GetMapping("/testauth")
    public String authtest() {
        return new String("Hello World");
    }

    
    
}
