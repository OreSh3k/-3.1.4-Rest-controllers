package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

public interface AdminService {

    public void addUser(User user);

    public void updateUser(User user);

    public void deleteUserById(int id);

}
