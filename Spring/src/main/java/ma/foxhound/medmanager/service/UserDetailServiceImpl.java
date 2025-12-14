package ma.foxhound.medmanager.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.foxhound.medmanager.repository.UserRepository;

@Service
@AllArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    UserRepository userRepository;

     @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       return userRepository.findByUsername(username);
    }
    
}
