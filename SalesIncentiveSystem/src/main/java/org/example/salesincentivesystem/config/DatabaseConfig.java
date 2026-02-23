package org.example.salesincentivesystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String normalizedUrl = dbUrl;

        // Render and other platforms sometimes provide URLs starting with postgresql://
        // or postgres://
        // Spring Boot requires jdbc:postgresql://
        if (normalizedUrl != null) {
            if (normalizedUrl.startsWith("postgresql://")) {
                normalizedUrl = "jdbc:" + normalizedUrl;
            } else if (normalizedUrl.startsWith("postgres://")) {
                normalizedUrl = "jdbc:postgresql://" + normalizedUrl.substring("postgres://".length());
            }
        }

        System.out.println("Initializing DataSource with normalized URL: " + normalizedUrl);

        return DataSourceBuilder.create()
                .url(normalizedUrl)
                .username(username)
                .password(password)
                .build();
    }
}
