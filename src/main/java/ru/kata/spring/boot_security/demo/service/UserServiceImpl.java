package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;


import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void createUser(User user) {
     userRepository.save(user);
    }

    @Override
    public List<User> readAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User readUser(int id) {
        return userRepository.findUserById(id);
    }

    public Optional<User> findByUsername(String username) {
       return userRepository.findByUsername(username);
    }

    @Override
    public boolean updateUser(User user, int id) {
        if(userRepository.findUserById(id) != null) {
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteUser(int id) {
         return userRepository.deleteUserById(id);
    }
}
