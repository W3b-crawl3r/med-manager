package ma.foxhound.medmanager.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.repository.UserRepository;

@Service
@AllArgsConstructor
public class AuthService{

    UserRepository userRepository;
    AuthenticationManager authenticationManager;
    JwtService jwtService;

    public String login(String username, String password) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        UserDetails ud = (UserDetails) auth.getPrincipal();
        return jwtService.generateToken(ud);
    }
    
}
