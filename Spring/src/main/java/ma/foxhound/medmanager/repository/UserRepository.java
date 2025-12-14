package ma.foxhound.medmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.foxhound.medmanager.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username); 
}
