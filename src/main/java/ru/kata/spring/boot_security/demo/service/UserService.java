package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    public List<User> readAllUsers();

    public User readUser(int id);

    public Optional<User> findByUsername(String username);
}
