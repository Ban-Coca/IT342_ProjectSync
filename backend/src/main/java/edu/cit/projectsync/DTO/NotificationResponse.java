package edu.cit.projectsync.DTO;

import edu.cit.projectsync.Entity.NotificationEntity;
import org.springframework.data.domain.Page;

import java.util.List;

public class NotificationResponse {
    private List<NotificationEntity> content;
    private int totalPages;
    private long totalElements;
    private int pageNumber;
    private int pageSize;
    private boolean first;
    private boolean last;

    public List<NotificationEntity> getContent() {
        return content;
    }

    public void setContent(List<NotificationEntity> content) {
        this.content = content;
    }

    public boolean isLast() {
        return last;
    }

    public void setLast(boolean last) {
        this.last = last;
    }

    public boolean isFirst() {
        return first;
    }

    public void setFirst(boolean first) {
        this.first = first;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public static NotificationResponse fromPage(Page<NotificationEntity> page) {
        NotificationResponse response = new NotificationResponse();
        response.setContent(page.getContent());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}