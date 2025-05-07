package com.ds39.mastermind;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {

   @GetMapping("/")
    public String greet(){
        return "Welcome to MasterMind , MasterMind.com";

   }
    
}