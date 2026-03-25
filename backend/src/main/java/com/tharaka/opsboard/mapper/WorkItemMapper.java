package com.tharaka.opsboard.mapper;

import com.tharaka.opsboard.dto.WorkItemRequestDto;
import com.tharaka.opsboard.dto.WorkItemResponseDto;
import com.tharaka.opsboard.entity.WorkItem;
import org.springframework.stereotype.Component;

@Component
public class WorkItemMapper {

    public WorkItemResponseDto toResponseDto(WorkItem workItem) {
        if (workItem == null) {
            return null;
        }

        return WorkItemResponseDto.builder()
                .id(workItem.getId())
                .title(workItem.getTitle())
                .description(workItem.getDescription())
                .status(workItem.getStatus())
                .priority(workItem.getPriority())
                .ownerName(workItem.getOwnerName())
                .environment(workItem.getEnvironment())
                .dueDate(workItem.getDueDate())
                .createdAt(workItem.getCreatedAt())
                .updatedAt(workItem.getUpdatedAt())
                .build();
    }

    public WorkItem toEntity(WorkItemRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }

        return WorkItem.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .status(requestDto.getStatus())
                .priority(requestDto.getPriority())
                .ownerName(requestDto.getOwnerName())
                .environment(requestDto.getEnvironment())
                .dueDate(requestDto.getDueDate())
                .build();
    }
}
