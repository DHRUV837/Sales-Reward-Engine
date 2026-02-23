package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Notification;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Notification> getUserNotifications(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long requestorId) {

        // If userId is missing, default to requestorId (Self-service)
        Long effectiveUserId = userId != null ? userId : requestorId;

        if (effectiveUserId == null) {
            return java.util.Collections.emptyList();
        }

        // Security Check: Self-only or Admin check
        if (requestorId != null && !requestorId.equals(effectiveUserId)) {
            // Check if requestor is admin of same org
            User requestor = java.util.Optional.ofNullable(requestorId).flatMap(userRepository::findById).orElse(null);
            User target = java.util.Optional.ofNullable(effectiveUserId).flatMap(userRepository::findById).orElse(null);
            if (requestor == null || target == null)
                return java.util.Collections.emptyList();

            boolean isGlobalAdmin = requestor.isAdminTypeGlobal();
            boolean isSameOrgAdmin = "ADMIN".equals(requestor.getRole()) &&
                    requestor.getOrganizationName() != null &&
                    requestor.getOrganizationName().equals(target.getOrganizationName());

            if (!isGlobalAdmin && !isSameOrgAdmin) {
                return java.util.Collections.emptyList();
            }
        }

        System.out.println("DEBUG: Fetching notifications for userId: " + effectiveUserId);
        return notificationRepository.findByUser_IdOrderByTimestampDesc(effectiveUserId);
    }

    @PostMapping
    public Notification createNotification(
            @RequestBody NotificationRequest request,
            @RequestParam(required = false) Long requestorId) {

        if (request.userId == null) {
            throw new RuntimeException("userId is required");
        }

        User targetUser = java.util.Optional.ofNullable(request.userId).flatMap(userRepository::findById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Permission Check: Global Admin OR same Org Admin
        if (requestorId != null) {
            User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor == null)
                throw new RuntimeException("Forbidden");

            boolean isGlobalAdmin = requestor.isAdminTypeGlobal();
            boolean isSameOrg = requestor.getOrganizationName() != null &&
                    requestor.getOrganizationName().equals(targetUser.getOrganizationName());

            if (!isGlobalAdmin && !isSameOrg) {
                throw new RuntimeException("Forbidden: Org mismatch");
            }
        }

        Notification notification = new Notification(targetUser, request.type, request.title, request.message);
        return notificationRepository.save(notification);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(
            @PathVariable Long id,
            @RequestParam(required = false) Long requestorId) {
        notificationRepository.findById(id != null ? id : -1L).ifPresent(n -> {
            // Permission Check: Must be the owner of the notification
            if (requestorId != null && !requestorId.equals(n.getUser().getId())) {
                return;
            }
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(
            @PathVariable Long id,
            @RequestParam(required = false) Long requestorId) {
        notificationRepository.findById(id != null ? id : -1L).ifPresent(n -> {
            // Permission Check
            if (requestorId != null && !requestorId.equals(n.getUser().getId())) {
                return;
            }
            notificationRepository.deleteById(id);
        });
    }

    @DeleteMapping
    @Transactional
    public void clearAllNotifications(
            @RequestParam Long userId,
            @RequestParam(required = false) Long requestorId) {
        if (requestorId != null && !requestorId.equals(userId)) {
            return;
        }
        notificationRepository.deleteByUserId(userId);
    }

    @PatchMapping("/read-all")
    public void markAllAsRead(
            @RequestParam Long userId,
            @RequestParam(required = false) Long requestorId) {
        if (requestorId != null && !requestorId.equals(userId)) {
            return;
        }
        List<Notification> notifications = notificationRepository.findByUser_Id(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @PostMapping("/broadcast")
    public void broadcastNotification(
            @RequestBody BroadcastRequest request,
            @RequestParam(required = false) Long requestorId) {

        String requestorOrg = null;
        boolean isGlobalAdmin = false;

        if (requestorId != null) {
            User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor != null) {
                requestorOrg = requestor.getOrganizationName();
                isGlobalAdmin = requestor.isAdminTypeGlobal();
            }
        }

        System.out.println(
                "DEBUG: Broadcast initiated. RequestorOrg=" + requestorOrg + ", TargetRole=" + request.targetRole);

        if ("USER".equalsIgnoreCase(request.targetRole) && request.targetUserId != null) {
            // Target specific user
            User targetUser = userRepository.findById(request.targetUserId)
                    .orElseThrow(() -> new RuntimeException("Target user not found"));

            // Security check
            if (!isGlobalAdmin && (requestorOrg == null || !requestorOrg.equals(targetUser.getOrganizationName()))) {
                throw new RuntimeException("Access Denied: Cross-org broadcast");
            }

            String notifType = request.type != null && !request.type.isEmpty() ? request.type : "ANNOUNCEMENT";
            String finalTitle = request.title.startsWith("ADMIN: ") ? request.title : "ADMIN: " + request.title;

            Notification n = new Notification(targetUser, notifType, finalTitle, request.message);
            notificationRepository.save(n);
        } else {
            // Target Group (ALL or Role)
            List<User> targetUsers;
            final String finalRequestorOrg = requestorOrg;
            final boolean finalIsGlobalAdmin = isGlobalAdmin;

            if ("ALL".equalsIgnoreCase(request.targetRole)) {
                targetUsers = userRepository.findAll().stream()
                        .filter(u -> finalIsGlobalAdmin
                                || (finalRequestorOrg != null && finalRequestorOrg.equals(u.getOrganizationName())))
                        .collect(java.util.stream.Collectors.toList());
            } else {
                String targetRoleNormalized = request.targetRole.toUpperCase();
                targetUsers = userRepository.findAll().stream()
                        .filter(u -> u.getRole() != null && targetRoleNormalized.equals(u.getRole().toUpperCase()))
                        .filter(u -> finalIsGlobalAdmin
                                || (finalRequestorOrg != null && finalRequestorOrg.equals(u.getOrganizationName())))
                        .collect(java.util.stream.Collectors.toList());
            }

            System.out.println("DEBUG: Found " + targetUsers.size() + " target users for broadcast within org.");

            String notifType = request.type != null && !request.type.isEmpty() ? request.type : "ANNOUNCEMENT";

            targetUsers.forEach(u -> {
                String finalTitle = request.title.startsWith("ADMIN: ") ? request.title : "ADMIN: " + request.title;
                Notification n = new Notification(u, notifType, finalTitle, request.message);
                notificationRepository.save(n);
            });

            // Audit Log for Bulk
            auditLogService.logAction(
                    requestorId,
                    "ADMIN",
                    "BROADCAST",
                    "NOTIFICATION",
                    0L,
                    "Sent to Role: " + request.targetRole + " | Org: " + requestorOrg + " | Count: "
                            + targetUsers.size());
        }
    }

    public static class BroadcastRequest {
        public String targetRole; // ALL, SALES, ADMIN, USER
        public Long targetUserId; // Optional: Used if targetRole is USER
        public String type; // ANNOUNCEMENT, POLICY_UPDATE, etc.
        public String title;
        public String message;
    }

    // DTO for request
    public static class NotificationRequest {
        public Long userId;
        public String type;
        public String title;
        public String message;
    }
}
