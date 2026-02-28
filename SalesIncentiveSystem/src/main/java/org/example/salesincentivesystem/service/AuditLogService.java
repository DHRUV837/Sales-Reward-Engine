package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.AuditLog;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void logAction(User actor, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(
                actor != null ? actor.getId() : null,
                actor != null ? actor.getEmail() : "SYSTEM",
                action,
                entityType,
                entityId,
                details,
                actor != null ? actor.getOrganizationName() : null);
        auditLogRepository.save(log);
    }

    // Overload for system actions or when User object isn't fully available but
    // ID/Email is known
    public void logAction(Long userId, String email, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(userId, email, action, entityType, entityId, details);
        // Attempt to find organization name if userId is provided
        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> log.setOrganizationName(user.getOrganizationName()));
        }
        auditLogRepository.save(log);
    }

    // New overload with explicit Org Name
    public void logAction(Long userId, String email, String action, String entityType, Long entityId, String details,
            String organizationName) {
        AuditLog log = new AuditLog(userId, email, action, entityType, entityId, details, organizationName);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs(String orgName) {
        if (orgName != null) {
            return auditLogRepository.findAllByOrganizationNameWithFallback(orgName);
        }
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "timestamp");
        return auditLogRepository.findAll(sort);
    }

    public List<AuditLog> searchLogs(String orgName, String action, String email, LocalDateTime start,
            LocalDateTime end) {
        return auditLogRepository.searchLogs(orgName, action, email, start, end);
    }
}
