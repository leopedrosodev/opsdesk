package com.opsdesk.application.usecases;

import com.opsdesk.domain.entities.TicketComment;

public record CommentWithAuthor(TicketComment comment, String authorName) {
}
