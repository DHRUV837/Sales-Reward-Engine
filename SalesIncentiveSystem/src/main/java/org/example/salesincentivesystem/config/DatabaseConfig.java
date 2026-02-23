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
        String finalUsername = username;
        String finalPassword = password;

        if (normalizedUrl != null) {
            // Remove jdbc: prefix for normalization parsing if it exists
            String connectionString = normalizedUrl;
            if (connectionString.startsWith("jdbc:")) {
                connectionString = connectionString.substring(5);
            }

            // Standard Render/Heroku format: postgresql://user:password@host:port/database
            if (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://")) {
                int doubleSlashIndex = connectionString.indexOf("//");
                String remainder = connectionString.substring(doubleSlashIndex + 2);

                int atIndex = remainder.indexOf("@");
                if (atIndex != -1) {
                    String credentialsPart = remainder.substring(0, atIndex);
                    String hostPart = remainder.substring(atIndex + 1);

                    // Extract credentials from URL
                    String[] creds = credentialsPart.split(":");
                    if (creds.length >= 2) {
                        finalUsername = creds[0];
                        finalPassword = creds[1];
                    }

                    normalizedUrl = "jdbc:postgresql://" + hostPart;
                } else {
                    normalizedUrl = "jdbc:postgresql://" + remainder;
                }
            } else if (!normalizedUrl.startsWith("jdbc:")) {
                normalizedUrl = "jdbc:" + normalizedUrl;
            }
        }

        System.out.println("Initializing DataSource with normalized URL: " + normalizedUrl);
        System.out.println("Using username extracted/provided: " + finalUsername);

        return DataSourceBuilder.create()
                .url(normalizedUrl)
                .username(finalUsername)
                .password(finalPassword)
                .build();
    }
}
