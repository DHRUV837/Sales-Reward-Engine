package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/api/test-email")
    public String sendTestEmail(@RequestParam String to) {
        try {
            emailService.sendWelcomeEmail(to, "Test User");
            return "Test email sent successfully via SendGrid to: " + to;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send email: " + e.getMessage();
        }
    }
}
