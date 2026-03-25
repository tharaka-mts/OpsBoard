package com.tharaka.opsboard.dto;

import com.tharaka.opsboard.entity.Environment;
import com.tharaka.opsboard.entity.Priority;
import com.tharaka.opsboard.entity.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class WorkItemResponseDto {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private String ownerName;
    private Environment environment;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
