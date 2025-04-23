package com.ds39.mastermind.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.ds39.mastermind.Entity.Users;
import com.ds39.mastermind.Repository.UserRepo;


@Service
public class UserService {

    @Autowired
	UserRepo userRepo;
	
	public Users submitMetaDataOfUser(Users user) {
		return userRepo.save(user);
	}
	
	public Users displayUserMetaData(String userid) {
		return userRepo.findByUserId(userid);
	}
}