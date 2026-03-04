create table users (
    id bigserial primary key,
    full_name varchar(120) not null,
    email varchar(160) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null,
    created_at timestamp with time zone not null,
    constraint chk_users_role check (role in ('ADMIN', 'TECH', 'USER'))
);

create table tickets (
    id bigserial primary key,
    title varchar(200) not null,
    description text not null,
    priority varchar(20) not null,
    status varchar(20) not null,
    creator_id bigint not null references users (id),
    assignee_id bigint references users (id),
    created_at timestamp with time zone not null,
    closed_at timestamp with time zone,
    constraint chk_tickets_priority check (priority in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    constraint chk_tickets_status check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

create table ticket_comments (
    id bigserial primary key,
    ticket_id bigint not null references tickets (id) on delete cascade,
    author_id bigint not null references users (id),
    content text not null,
    created_at timestamp with time zone not null
);

create table assets (
    id bigserial primary key,
    name varchar(140) not null,
    type varchar(80) not null,
    owner_id bigint references users (id),
    ip_address varchar(45),
    location varchar(180)
);

create table asset_tags (
    asset_id bigint not null references assets (id) on delete cascade,
    tag varchar(50) not null,
    primary key (asset_id, tag)
);

create table ticket_assets (
    id bigserial primary key,
    ticket_id bigint not null references tickets (id) on delete cascade,
    asset_id bigint not null references assets (id) on delete cascade,
    unique (ticket_id, asset_id)
);

create table runbooks (
    id bigserial primary key,
    title varchar(180) not null,
    description text not null,
    steps text not null,
    author_id bigint not null references users (id),
    created_at timestamp with time zone not null
);

create index idx_tickets_status on tickets (status);
create index idx_tickets_priority on tickets (priority);
create index idx_tickets_assignee on tickets (assignee_id);
create index idx_ticket_comments_ticket_id on ticket_comments (ticket_id);
