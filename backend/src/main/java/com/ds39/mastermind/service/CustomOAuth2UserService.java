package com.ds39.mastermind.service;

import com.ds39.mastermind.model.Profile;
import com.ds39.mastermind.repository.ProfileRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final ProfileRepository profileRepository;

    public CustomOAuth2UserService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        Profile profile = profileRepository.findByEmail(email)
            .orElseGet(() -> {
                Profile newProfile = new Profile();
                newProfile.setEmail(email);
                newProfile.setName((String) attributes.get("name"));
                return profileRepository.save(newProfile);
            });

        return oAuth2User;
    }
}