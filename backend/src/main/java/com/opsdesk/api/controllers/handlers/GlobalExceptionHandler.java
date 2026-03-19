package com.opsdesk.api.controllers.handlers;

import com.opsdesk.api.dto.common.ApiErrorResponse;
import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.application.exceptions.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining(", "));

        return build(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor", request.getRequestURI());
    }

    private String formatFieldError(FieldError error) {
        String message = switch (error.getCode()) {
            case "NotBlank" -> "nao pode estar em branco";
            case "NotNull" -> "nao pode ser nulo";
            case "Email" -> "deve ser um email valido";
            case "Size" -> buildSizeMessage(error);
            default -> error.getDefaultMessage();
        };

        return error.getField() + " " + message;
    }

    private String buildSizeMessage(FieldError error) {
        Object min = error.getArguments() != null && error.getArguments().length > 2 ? error.getArguments()[2] : null;
        Object max = error.getArguments() != null && error.getArguments().length > 1 ? error.getArguments()[1] : null;

        if (min instanceof Integer minValue && max instanceof Integer maxValue) {
            if (minValue > 0 && maxValue < Integer.MAX_VALUE) {
                return "deve ter entre " + minValue + " e " + maxValue + " caracteres";
            }
            if (minValue > 0) {
                return "deve ter no minimo " + minValue + " caracteres";
            }
            return "deve ter no maximo " + maxValue + " caracteres";
        }

        return "possui tamanho invalido";
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, String path) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                translateStatus(status),
                message,
                path
        );

        return ResponseEntity.status(status).body(body);
    }

    private String translateStatus(HttpStatus status) {
        return switch (status) {
            case BAD_REQUEST -> "Requisicao invalida";
            case UNAUTHORIZED -> "Nao autorizado";
            case FORBIDDEN -> "Acesso negado";
            case NOT_FOUND -> "Nao encontrado";
            case INTERNAL_SERVER_ERROR -> "Erro interno do servidor";
            default -> status.getReasonPhrase();
        };
    }
}
