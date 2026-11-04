create table users
(
    id             int generated always as identity primary key,
    email          varchar(100) not null,
    password       varchar(100) not null,
    isActivated    boolean default false,
    activationLink varchar(100) not null
);

create table tokens
(
    id           int generated always as identity primary key,
    username     varchar(200),
    refreshToken varchar(200) not null
);