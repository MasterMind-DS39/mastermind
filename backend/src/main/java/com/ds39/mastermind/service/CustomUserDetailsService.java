package com.ds39.mastermind.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.ds39.mastermind.model.Profile;
import com.ds39.mastermind.repository.ProfileRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Profile profile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(
                profile.getUsername(),
                profile.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + profile.getRole()))
        );
    }
}