package com.ds39.mastermind.exceptions;

public class ProfileNotFoundException extends RuntimeException {

    public ProfileNotFoundException(Long id){
        super("Could not found the profile with id "+ id);
    }

}
