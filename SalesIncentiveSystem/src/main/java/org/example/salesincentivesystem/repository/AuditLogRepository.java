package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

        @Query("SELECT a FROM AuditLog a WHERE " +
                        "(:orgName IS NULL OR a.organizationName = :orgName OR (a.userId IS NOT NULL AND EXISTS (SELECT 1 FROM User u WHERE u.id = a.userId AND u.organizationName = :orgName))) AND "
                        +
                        "(:action IS NULL OR LOWER(a.action) LIKE LOWER(CONCAT('%', :action, '%'))) AND " +
                        "(:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
                        "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
                        "(:endDate IS NULL OR a.timestamp <= :endDate) " +
                        "ORDER BY a.timestamp DESC")
        List<AuditLog> searchLogs(@Param("orgName") String orgName,
                        @Param("action") String action,
                        @Param("email") String email,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        List<AuditLog> findByOrganizationName(String organizationName, org.springframework.data.domain.Sort sort);

        boolean existsByUserIdAndAction(Long userId, String action);
}
