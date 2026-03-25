package com.tharaka.opsboard.repository;

import com.tharaka.opsboard.entity.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {
}
