package com.tharaka.opsboard.controller;

import com.tharaka.opsboard.dto.WorkItemRequestDto;
import com.tharaka.opsboard.dto.WorkItemResponseDto;
import com.tharaka.opsboard.service.WorkItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkItemController {

    private final WorkItemService workItemService;

    @GetMapping
    public ResponseEntity<List<WorkItemResponseDto>> getAllWorkItems() {
        return ResponseEntity.ok(workItemService.getAllWorkItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkItemResponseDto> getWorkItemById(@PathVariable Long id) {
        return ResponseEntity.ok(workItemService.getWorkItemById(id));
    }

    @PostMapping
    public ResponseEntity<WorkItemResponseDto> createWorkItem(@Valid @RequestBody WorkItemRequestDto requestDto) {
        WorkItemResponseDto created = workItemService.createWorkItem(requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkItemResponseDto> updateWorkItem(
            @PathVariable Long id, 
            @Valid @RequestBody WorkItemRequestDto requestDto) {
        return ResponseEntity.ok(workItemService.updateWorkItem(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkItem(@PathVariable Long id) {
        workItemService.deleteWorkItem(id);
        return ResponseEntity.noContent().build();
    }
}
