package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.RuleConfig;
import org.example.salesincentivesystem.repository.RuleConfigRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rules")
public class RuleController {

    private final RuleConfigRepository ruleRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public RuleController(RuleConfigRepository ruleRepository,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.ruleRepository = ruleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<RuleConfig> getAllRules(@RequestParam(required = false) Long requestorId) {
        String orgName = null;
        if (requestorId != null) {
            orgName = userRepository.findById(requestorId)
                    .map(org.example.salesincentivesystem.entity.User::getOrganizationName)
                    .orElse(null);
        }

        if (orgName != null) {
            List<RuleConfig> rules = ruleRepository.findByOrganizationName(orgName);
            if (rules.isEmpty()) {
                createDefaultRule("Big Deal Alert", "DEAL_AMOUNT", "GT", 100000, "NOTIFY_ADMIN", orgName);
                createDefaultRule("High Discount Warning", "DISCOUNT_RATE", "GT", 15, "FLAG_RISK", orgName);
                return ruleRepository.findByOrganizationName(orgName);
            }
            return rules;
        }

        // Global Admin / Fallback
        return ruleRepository.findAll();
    }

    private void createDefaultRule(String name, String metric, String op, double val, String action, String orgName) {
        RuleConfig r = new RuleConfig();
        r.setName(name);
        r.setMetric(metric);
        r.setOperator(op);
        r.setThreshold(val);
        r.setAction(action);
        r.setOrganizationName(orgName);
        ruleRepository.save(r);
    }

    @PostMapping
    public RuleConfig saveRule(@RequestBody RuleConfig rule, @RequestParam(required = false) Long requestorId) {
        if (requestorId != null) {
            userRepository.findById(requestorId).ifPresent(user -> {
                if (user.getOrganizationName() != null) {
                    rule.setOrganizationName(user.getOrganizationName());
                }
            });
        }
        return ruleRepository.save(rule);
    }

    @DeleteMapping("/{id}")
    public void deleteRule(@PathVariable Long id) {
        ruleRepository.deleteById(id);
    }
}
