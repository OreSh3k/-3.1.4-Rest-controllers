package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    public void createUser(User user);

    public List<User> readAllUsers();

    public User readUser(int id);

    public boolean updateUser(User user, int id);

    public boolean deleteUser(int id);
}
