package org.example.salesincentivesystem.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${SENDGRID_API_KEY:}")
    private String sendGridApiKey;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    private static final String FROM_EMAIL = "teamsalesrewardengine@gmail.com";
    private static final String FROM_NAME = "Sales Reward Engine";

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            Email from = new Email(FROM_EMAIL, FROM_NAME);
            Email toEmail = new Email(to);
            String subject = "Welcome to Sales Reward Engine - Enterprise Edition";

            String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
                        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #4f46e5 0px, #7c3aed 100px); padding: 40px 20px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Sales Reward Engine</h1>
                                <p style="margin: 8px 0 0 0; font-size: 16px; color: #e0e7ff;">Enterprise Sales Performance Platform</p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Welcome aboard, %s! 🚀</h2>

                                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We are thrilled to have you join our enterprise platform. Your workspace has been successfully created and is ready for action.</p>

                                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                        <strong>Pro Tip:</strong> Start by inviting your sales team and configuring your first incentive policy to see immediate results.
                                    </p>
                                </div>

                                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">You can now access your dashboard to view your incentives, track real-time performance, and manage your deals.</p>

                                <!-- Button -->
                                <div style="margin: 32px 0; text-align: center;">
                                    <a href="%s/login" target="_blank" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                        Access Dashboard
                                    </a>
                                </div>

                                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

                                <p style="color: #6b7280; font-size: 14px;">If you have any questions, our support team is available 24/7.</p>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 0;">© 2026 Sales Reward Engine. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .formatted(name, frontendUrl);

            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, toEmail, content);

            sendEmail(mail);
            System.out.println("Welcome email sent via SendGrid to: " + to);

        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
            System.out.println("==================================================");
            System.out.println("To: " + to);
            System.out.println("Subject: Welcome to Sales Reward Engine");
            System.out.println("Content: Welcome aboard, " + name + "! Your account is ready.");
            System.out.println("==================================================");
            // Don't block registration if email fails
        }
    }

    public void sendInvitationEmail(String to, String inviteLink, String inviterName, String companyName)
            throws Exception {
        try {
            Email from = new Email(FROM_EMAIL, FROM_NAME);
            Email toEmail = new Email(to);
            String subject = "You've been invited to join " + companyName + " on Sales Reward Engine";

            String htmlContent = """
                        <html>
                        <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                <div style="background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Sales Reward Engine</h1>
                                </div>
                                <div style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Hello there!</h2>
                                    <p style="color: #4b5563; font-size: 16px;">
                                        <strong>%s</strong> from <strong>%s</strong> has invited you to join their sales team on Sales Reward Engine.
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px;">Accept the invitation to start tracking your deals, viewing your real-time performance, and earning rewards.</p>
                                    <div style="margin: 32px 0; text-align: center;">
                                        <a href="%s" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                            Join the Team
                                        </a>
                                    </div>
                                    <p style="color: #6b7280; font-size: 14px;">This invitation link will expire in 48 hours. If you didn't expect this, you can safely ignore this email.</p>
                                </div>
                                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">&copy; 2026 Sales Reward Engine. All rights reserved.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                    .formatted(inviterName, companyName, inviteLink);

            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, toEmail, content);

            sendEmail(mail);
            System.out.println("Invitation email sent via SendGrid to: " + to);

        } catch (Exception e) {
            System.err.println("Failed to send invitation email: " + e.getMessage());
            System.out.println("==================================================");
            System.out.println("To: " + to);
            System.out.println("Subject: You've been invited to join " + companyName);
            System.out.println("Invited By: " + inviterName);
            System.out.println("Link: " + inviteLink);
            System.out.println("==================================================");
            throw e;
        }
    }

    private void sendEmail(Mail mail) throws Exception {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            throw new IllegalStateException("SENDGRID_API_KEY environment variable is not set");
        }
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sg.api(request);
        System.out.println("SendGrid response status: " + response.getStatusCode());
        if (response.getStatusCode() >= 400) {
            throw new RuntimeException("SendGrid error: " + response.getStatusCode() + " - " + response.getBody());
        }
    }
}
