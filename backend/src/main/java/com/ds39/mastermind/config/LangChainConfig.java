package com.ds39.mastermind.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LangChainConfig {

    @Bean
    public OpenAiChatModel openAiChatModel() {
        return OpenAiChatModel.builder()
                .apiKey("YOUR_OPENAI")
                .modelName("gpt-3.5-turbo") 
                .temperature(0.7)
                .build();
    }
}