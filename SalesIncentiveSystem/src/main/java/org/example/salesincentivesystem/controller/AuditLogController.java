package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public AuditLogController(AuditLogService auditLogService,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<org.example.salesincentivesystem.entity.AuditLog> getAllLogs(
            @RequestParam(required = false) Long requestorId) {
        String orgName = null;
        if (requestorId != null) {
            orgName = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::getOrganizationName)
                    .orElse(null);

            // SECURITY: If not global admin, must filter by org
            boolean isGlobalAdmin = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::isAdminTypeGlobal)
                    .orElse(false);

            if (!isGlobalAdmin && orgName == null) {
                return java.util.Collections.emptyList();
            }

            if (!isGlobalAdmin) {
                return auditLogService.getAllLogs(orgName);
            }
        }
        return auditLogService.getAllLogs(null);
    }

    @GetMapping("/search")
    public List<org.example.salesincentivesystem.entity.AuditLog> searchLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate,
            @RequestParam(required = false) Long requestorId) {

        String orgName = null;
        if (requestorId != null) {
            orgName = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::getOrganizationName)
                    .orElse(null);

            boolean isGlobalAdmin = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::isAdminTypeGlobal)
                    .orElse(false);

            if (!isGlobalAdmin) {
                if (orgName == null)
                    return java.util.Collections.emptyList();
                return auditLogService.searchLogs(orgName, action, email, startDate, endDate);
            }
        }

        return auditLogService.searchLogs(null, action, email, startDate, endDate);
    }
}
