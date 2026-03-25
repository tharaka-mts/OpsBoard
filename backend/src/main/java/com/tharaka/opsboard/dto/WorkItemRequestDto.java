package com.tharaka.opsboard.dto;

import com.tharaka.opsboard.entity.Environment;
import com.tharaka.opsboard.entity.Priority;
import com.tharaka.opsboard.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkItemRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Owner name is required")
    private String ownerName;

    @NotNull(message = "Environment is required")
    private Environment environment;

    private LocalDate dueDate;
}
