package com.opsdesk.api.dto.common;

import com.opsdesk.domain.shared.PageResult;

import java.util.List;
import java.util.function.Function;

public record PagedResponse<T>(
        List<T> content,
        long total,
        int page,
        int size,
        int totalPages
) {
    public static <D, T> PagedResponse<T> from(PageResult<D> result, Function<D, T> mapper) {
        return new PagedResponse<>(
                result.content().stream().map(mapper).toList(),
                result.total(),
                result.page(),
                result.size(),
                result.totalPages()
        );
    }
}
