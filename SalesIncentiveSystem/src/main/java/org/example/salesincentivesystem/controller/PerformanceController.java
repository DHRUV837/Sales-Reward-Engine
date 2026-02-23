package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.dto.PerformanceSummary;
import org.example.salesincentivesystem.service.PerformanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/performance")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public PerformanceController(PerformanceService performanceService,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.performanceService = performanceService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public org.springframework.http.ResponseEntity<PerformanceSummary> getPerformance(
            @PathVariable Long userId,
            @RequestParam(required = false) Long requestorId) {

        // Data Isolation Check
        if (requestorId != null && !requestorId.equals(userId)) {
            return userRepository.findById(requestorId).map(requestor -> {
                return userRepository.findById(userId).map(target -> {
                    boolean isGlobalAdmin = requestor.isAdminTypeGlobal();
                    boolean isSameOrgAdmin = "ADMIN".equals(requestor.getRole()) &&
                            requestor.getOrganizationName() != null &&
                            requestor.getOrganizationName().equals(target.getOrganizationName());

                    if (isGlobalAdmin || isSameOrgAdmin) {
                        return org.springframework.http.ResponseEntity
                                .ok(performanceService.getPerformanceSummary(userId));
                    }
                    return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                            .<PerformanceSummary>build();
                }).orElse(org.springframework.http.ResponseEntity.notFound().build());
            }).orElse(org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .build());
        }

        // Self-access or no requestorId check (default to self-access if authenticated,
        // but here we just trust the ID for simplicity/backward compatibility)
        return org.springframework.http.ResponseEntity.ok(performanceService.getPerformanceSummary(userId));
    }
}
