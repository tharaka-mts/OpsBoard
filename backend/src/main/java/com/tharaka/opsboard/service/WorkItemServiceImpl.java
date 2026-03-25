package com.tharaka.opsboard.service;

import com.tharaka.opsboard.dto.WorkItemRequestDto;
import com.tharaka.opsboard.dto.WorkItemResponseDto;
import com.tharaka.opsboard.entity.WorkItem;
import com.tharaka.opsboard.exception.ResourceNotFoundException;
import com.tharaka.opsboard.mapper.WorkItemMapper;
import com.tharaka.opsboard.repository.WorkItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkItemServiceImpl implements WorkItemService {

    private final WorkItemRepository workItemRepository;
    private final WorkItemMapper workItemMapper;

    @Override
    @Transactional(readOnly = true)
    public List<WorkItemResponseDto> getAllWorkItems() {
        log.info("Fetching all work items");
        return workItemRepository.findAll().stream()
                .map(workItemMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WorkItemResponseDto getWorkItemById(Long id) {
        log.info("Fetching work item by id: {}", id);
        WorkItem workItem = workItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work item not found with id: " + id));
        return workItemMapper.toResponseDto(workItem);
    }

    @Override
    @Transactional
    public WorkItemResponseDto createWorkItem(WorkItemRequestDto requestDto) {
        log.info("Creating new work item: {}", requestDto.getTitle());
        WorkItem workItem = workItemMapper.toEntity(requestDto);
        WorkItem savedWorkItem = workItemRepository.save(workItem);
        return workItemMapper.toResponseDto(savedWorkItem);
    }

    @Override
    @Transactional
    public WorkItemResponseDto updateWorkItem(Long id, WorkItemRequestDto requestDto) {
        log.info("Updating work item with id: {}", id);
        WorkItem existingWorkItem = workItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work item not found with id: " + id));

        existingWorkItem.setTitle(requestDto.getTitle());
        existingWorkItem.setDescription(requestDto.getDescription());
        existingWorkItem.setStatus(requestDto.getStatus());
        existingWorkItem.setPriority(requestDto.getPriority());
        existingWorkItem.setOwnerName(requestDto.getOwnerName());
        existingWorkItem.setEnvironment(requestDto.getEnvironment());
        existingWorkItem.setDueDate(requestDto.getDueDate());

        WorkItem updatedWorkItem = workItemRepository.save(existingWorkItem);
        return workItemMapper.toResponseDto(updatedWorkItem);
    }

    @Override
    @Transactional
    public void deleteWorkItem(Long id) {
        log.info("Deleting work item with id: {}", id);
        WorkItem existingWorkItem = workItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work item not found with id: " + id));
        
        workItemRepository.delete(existingWorkItem);
    }
}
