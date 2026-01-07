package ma.foxhound.medmanager.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.repository.UserRepository;
import ma.foxhound.medmanager.enums.Role;

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

    public String loginWithRole(String username, String password, Role expectedRole) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        UserDetails ud = (UserDetails) auth.getPrincipal();
        boolean hasRole = ud.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(a -> a.equals("ROLE_" + expectedRole.name()));
        if (!hasRole) {
            throw new IllegalArgumentException("User does not have required role: " + expectedRole.name());
        }
        return jwtService.generateToken(ud);
    }
    
}
