package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.SalesPerformance;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.SalesPerformanceRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/performance")
public class SalesPerformanceController {

    private final SalesPerformanceRepository performanceRepository;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.PerformanceService performanceService;

    public SalesPerformanceController(SalesPerformanceRepository performanceRepository, UserRepository userRepository,
            org.example.salesincentivesystem.service.PerformanceService performanceService) {
        this.performanceRepository = performanceRepository;
        this.userRepository = userRepository;
        this.performanceService = performanceService;
    }

    /**
     * Helper method to check user permissions for accessing or modifying
     * performance data.
     *
     * @param requestorId  The ID of the user making the request.
     * @param targetUserId The ID of the user whose data is being accessed/modified.
     * @return ResponseEntity.status(FORBIDDEN) if permission is denied, or null if
     *         permission is granted.
     */
    private ResponseEntity<?> checkPermission(Long requestorId, Long targetUserId) {
        if (requestorId == null || requestorId.equals(targetUserId)) {
            // No requestorId provided (implies self-access or no specific permission check
            // needed for self)
            // Or requestor is accessing their own data, which is always allowed.
            return null;
        }

        User requestor = userRepository.findById(requestorId).orElse(null);
        User target = userRepository.findById(targetUserId).orElse(null);

        if (requestor == null || target == null) {
            // If either user doesn't exist, or requestor is trying to access data for a
            // non-existent user,
            // and they are not the target user, deny access.
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }

        boolean isGlobalAdmin = requestor.isAdminTypeGlobal();
        boolean isSameOrgAdmin = "ADMIN".equals(requestor.getRole()) &&
                requestor.getOrganizationName() != null &&
                requestor.getOrganizationName().equals(target.getOrganizationName());

        if (!isGlobalAdmin && !isSameOrgAdmin) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        return null; // Permission granted
    }

    @GetMapping("/summary")
    public ResponseEntity<org.example.salesincentivesystem.dto.PerformanceSummary> getPerformanceSummary(
            @RequestParam Long userId,
            @RequestParam(required = false) Long requestorId) {

        ResponseEntity<?> permissionCheckResult = checkPermission(requestorId, userId);
        if (permissionCheckResult != null) {
            return (ResponseEntity<org.example.salesincentivesystem.dto.PerformanceSummary>) permissionCheckResult;
        }

        return ResponseEntity.ok(performanceService.getPerformanceSummary(userId));
    }

    @GetMapping
    public ResponseEntity<SalesPerformance> getPerformance(
            @RequestParam Long userId,
            @RequestParam(required = false) Long requestorId) {

        ResponseEntity<?> permissionCheckResult = checkPermission(requestorId, userId);
        if (permissionCheckResult != null) {
            return (ResponseEntity<SalesPerformance>) (ResponseEntity<?>) permissionCheckResult;
        }

        return performanceRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    // Create default if not exists
                    User user = userRepository.findById(userId).orElse(null);
                    if (user == null)
                        return ResponseEntity.notFound().build();

                    SalesPerformance defaultPerf = new SalesPerformance(user, 100000.0, 0.0, "");
                    try {
                        return ResponseEntity.ok(performanceRepository.save(defaultPerf));
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                    }
                });
    }

    @PutMapping("/target")
    public ResponseEntity<?> updateTarget(
            @RequestBody Map<String, Object> payload,
            @RequestParam(required = false) Long requestorId) {

        Long userId = ((Number) payload.get("userId")).longValue();
        Double target = ((Number) payload.get("target")).doubleValue();

        ResponseEntity<?> permissionCheckResult = checkPermission(requestorId, userId);
        if (permissionCheckResult != null) {
            return permissionCheckResult;
        }

        return performanceRepository.findByUserId(userId)
                .map(perf -> {
                    perf.setCurrentMonthTarget(target);
                    performanceRepository.save(perf);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElse(null);
                    if (user == null)
                        return ResponseEntity.notFound().build();

                    SalesPerformance newPerf = new SalesPerformance(user, target, 0.0, "");
                    performanceRepository.save(newPerf);
                    return ResponseEntity.ok().build();
                });
    }
}
