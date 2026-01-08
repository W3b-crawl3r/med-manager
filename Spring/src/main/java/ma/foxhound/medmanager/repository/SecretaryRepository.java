package ma.foxhound.medmanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.foxhound.medmanager.model.SecretaryModel;

@Repository
public interface SecretaryRepository extends JpaRepository<SecretaryModel, Long> {
    Optional<SecretaryModel> findByUsername(String username);
}
