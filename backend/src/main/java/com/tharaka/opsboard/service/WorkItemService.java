package com.tharaka.opsboard.service;

import com.tharaka.opsboard.dto.WorkItemRequestDto;
import com.tharaka.opsboard.dto.WorkItemResponseDto;

import java.util.List;

public interface WorkItemService {
    List<WorkItemResponseDto> getAllWorkItems();
    WorkItemResponseDto getWorkItemById(Long id);
    WorkItemResponseDto createWorkItem(WorkItemRequestDto requestDto);
    WorkItemResponseDto updateWorkItem(Long id, WorkItemRequestDto requestDto);
    void deleteWorkItem(Long id);
}
