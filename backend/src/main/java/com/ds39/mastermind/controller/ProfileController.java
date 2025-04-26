package com.ds39.mastermind.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.exceptions.ProfileNotFoundException;
import com.ds39.mastermind.model.Profile;
import com.ds39.mastermind.repository.ProfileRepository;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ProfileController {

    @Autowired
     private ProfileRepository profilerepository;

     @PostMapping("/profile")
     Profile newProfile(@RequestBody Profile newProfile) {
         return profilerepository.save(newProfile);
     }

     @GetMapping("/profiles")
     List<Profile> getAllProfiles() {
         return profilerepository.findAll();
     }

     @GetMapping("/profile/{id}")
     Profile getUserById(@PathVariable Long id) {
         return profilerepository.findById(id)
                 .orElseThrow(() -> new ProfileNotFoundException(id));
     }

     @PutMapping("/profile/{id}")
     Profile updateUser(@RequestBody Profile newUser, @PathVariable Long id) {
         return profilerepository.findById(id)
                 .map(user -> {
                     user.setUsername(newUser.getUsername());
                     user.setName(newUser.getName());
                     user.setEmail(newUser.getEmail());
                     return profilerepository.save(user);
                 }).orElseThrow(() -> new ProfileNotFoundException(id));
     }

      @DeleteMapping("/profile/{id}")
     String deleteProfile(@PathVariable Long id){
         if(!profilerepository.existsById(id)){
             throw new ProfileNotFoundException(id);
         }
         profilerepository.deleteById(id);
         return  "Profile with id "+id+" has been deleted success.";
     }

   

}
