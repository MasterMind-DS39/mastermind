package com.ds39.mastermind.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.ds39.mastermind.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile,Long>{
    Optional<Profile> findByUsername(String username);
    Optional<Profile> findByEmail(String email);
}
