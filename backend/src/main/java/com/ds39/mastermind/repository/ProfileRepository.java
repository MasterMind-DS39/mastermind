package com.ds39.mastermind.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile,Long>{

}
