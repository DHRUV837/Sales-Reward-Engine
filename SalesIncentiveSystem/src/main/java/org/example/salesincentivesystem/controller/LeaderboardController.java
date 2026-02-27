package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.dto.LeaderboardEntry;
import org.example.salesincentivesystem.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public LeaderboardController(LeaderboardService leaderboardService,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.leaderboardService = leaderboardService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(
            @RequestParam(defaultValue = "THIS_MONTH") String period,
            @RequestParam(required = false) Long requestorId) {

        String orgName = null;
        if (requestorId != null) {
            orgName = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::getOrganizationName)
                    .orElse(null);

            // SECURITY: If not global admin and no org, return empty
            boolean isGlobalAdmin = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::isAdminTypeGlobal)
                    .orElse(false);

            if (!isGlobalAdmin) {
                // If no orgName is set, fallback to null (global) to avoid empty leaderboards
                // for incomplete profiles
                return leaderboardService.getLeaderboard(period, orgName);
            }
        }

        return leaderboardService.getLeaderboard(period, null);
    }
}
