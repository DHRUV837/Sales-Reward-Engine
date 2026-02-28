package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.SalesPerformance;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.SalesPerformanceRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/targets")
public class TargetController {

    private final SalesPerformanceRepository salesPerformanceRepository;
    private final UserRepository userRepository;

    public TargetController(SalesPerformanceRepository salesPerformanceRepository, UserRepository userRepository) {
        this.salesPerformanceRepository = salesPerformanceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<?> getAllTargets(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long requestorId) {
        if (requestorId != null) {
            org.example.salesincentivesystem.entity.User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor != null) {
                if (requestor.isAdminTypeGlobal()) {
                    return org.springframework.http.ResponseEntity.ok(salesPerformanceRepository.findAll());
                } else {
                    String orgName = requestor.getOrganizationName();
                    if (orgName == null) {
                        return org.springframework.http.ResponseEntity.ok(java.util.Collections.emptyList());
                    }
                    java.util.List<SalesPerformance> all = salesPerformanceRepository.findAll();
                    java.util.List<SalesPerformance> filtered = all.stream()
                            .filter(p -> p.getUser() != null && orgName.equals(p.getUser().getOrganizationName()))
                            .collect(java.util.stream.Collectors.toList());
                    return org.springframework.http.ResponseEntity.ok(filtered);
                }
            }
        }
        return org.springframework.http.ResponseEntity.ok(salesPerformanceRepository.findAll());
    }

    /**
     * Get target for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTargetByUserId(@PathVariable Long userId) {
        return salesPerformanceRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create or update a target/performance goal
     */
    @PostMapping
    public ResponseEntity<?> createOrUpdateTarget(@RequestBody Map<String, Object> payload) {
        try {
            if (payload.get("userId") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
            }
            Long userId = Long.parseLong(payload.get("userId").toString());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if target already exists for this user
            SalesPerformance performance = salesPerformanceRepository.findByUserId(userId)
                    .orElse(new SalesPerformance());

            performance.setUser(user);

            if (payload.containsKey("currentMonthTarget")) {
                performance.setCurrentMonthTarget(Double.parseDouble(payload.get("currentMonthTarget").toString()));
            }
            if (payload.containsKey("performanceRating")) {
                performance.setPerformanceRating(Double.parseDouble(payload.get("performanceRating").toString()));
            }
            if (payload.containsKey("achievements")) {
                performance.setAchievements((String) payload.get("achievements"));
            }

            SalesPerformance savedPerformance = salesPerformanceRepository.save(performance);

            // AUTO-TRACK ONBOARDING
            if (payload.containsKey("createdBy") && payload.get("createdBy") != null) {
                try {
                    Long adminId = Long.parseLong(payload.get("createdBy").toString());
                    userRepository.findById(adminId).ifPresent(admin -> {
                        if (admin.getFirstTargetCreated() == null || !admin.getFirstTargetCreated()) {
                            admin.setFirstTargetCreated(true);
                            userRepository.save(admin);
                        }
                    });
                } catch (Exception ignored) {
                    // Silently fail if onboarding tracking fails to avoid blocking target creation
                }
            }

            return ResponseEntity.ok(savedPerformance);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create target: " + e.getMessage()));
        }
    }

    /**
     * Delete a target
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTarget(@PathVariable Long id) {
        salesPerformanceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Target deleted successfully"));
    }
}
