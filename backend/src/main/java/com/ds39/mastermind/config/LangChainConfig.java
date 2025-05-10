package com.ds39.mastermind.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class LangChainConfig {
    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Bean
    public OpenAiChatModel openAiChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(openAiApiKey) // Replace with your OpenAI API key
                .modelName("gpt-3.5-turbo") 
                .temperature(0.7)
                .build();
    }
}