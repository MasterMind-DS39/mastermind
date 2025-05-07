package com.ds39.mastermind.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.ds39.mastermind.exceptions.ProfileNotFoundException;
import com.ds39.mastermind.model.Profile;
import com.ds39.mastermind.repository.ProfileRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository; 

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Profile registerUser(@RequestBody Profile newProfile) {
        newProfile.setPassword(passwordEncoder.encode(newProfile.getPassword()));
        return profileRepository.save(newProfile);
    }

    @GetMapping("/api/check-auth")
    public Map<String, Boolean> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && 
                                authentication.isAuthenticated() && 
                                !(authentication.getPrincipal() instanceof String);
        return Collections.singletonMap("isAuthenticated", isAuthenticated);
    }

    @PostMapping("/profile")
    Profile newProfile(@RequestBody Profile newProfile) {
        return profileRepository.save(newProfile);
    }

    // @PreAuthorize("hasRole('USER')")
    // @GetMapping("/profiles")
    // public ResponseEntity<List<Profile>> getAllProfiles() {
    //     List<Profile> profiles = profileRepository.findAll();
    //     return ResponseEntity.ok().body(profiles);
    // }

    @GetMapping("/profiles")
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    // @PreAuthorize("hasRole('USER')")
    @GetMapping("/profile/{id}")
    Profile getUserById(@PathVariable Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException(id));
    }

    @PutMapping("/profile/{id}")
    Profile updateUser(@RequestBody Profile newUser, @PathVariable Long id) {
        return profileRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(newUser.getUsername());
                    existingUser.setName(newUser.getName());
                    existingUser.setEmail(newUser.getEmail());
                    return profileRepository.save(existingUser);
                }).orElseThrow(() -> new ProfileNotFoundException(id));
    }

    @DeleteMapping("/profile/{id}")
    String deleteProfile(@PathVariable Long id){
        if(!profileRepository.existsById(id)){
            throw new ProfileNotFoundException(id);
        }
        profileRepository.deleteById(id);
        return  "Profile with id "+id+" has been deleted success.";
    }
}