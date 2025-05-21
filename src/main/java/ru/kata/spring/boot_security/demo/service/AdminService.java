package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

public interface AdminService  {

    public void createUser(User user);

    public boolean updateUser(User user, int id);

    public boolean deleteUser(int id);

}
