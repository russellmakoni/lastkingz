package com.lastKings.ecom.inventory_management.service;

import com.lastKings.ecom.inventory_management.Exception.UserNotFOUND;
import com.lastKings.ecom.inventory_management.model.ERole;
import com.lastKings.ecom.inventory_management.model.Role;
import com.lastKings.ecom.inventory_management.model.UserDTO;
import com.lastKings.ecom.inventory_management.model.Users;
import com.lastKings.ecom.inventory_management.repository.RoleRepository;
import com.lastKings.ecom.inventory_management.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final RoleRepository roleRepository;
    public UserService(UserRepo userRepo, RoleRepository roleRepository) {
        this.userRepo = userRepo;
        this.roleRepository = roleRepository;
    }
    public List<UserDTO> getAllUsers() {
     List<Users> users = userRepo.findAll();
     return users.stream().map(user->new UserDTO(
             user.getId(),
             user.getUsername(),
             user.getRoles().stream().map(role->role.getName().name()).collect(Collectors.toSet())

             )).collect(Collectors.toList());
    }
    @Transactional
    public UserDTO updateUser(Long id,UserDTO userDTO) {
         Users user = userRepo.findById(id).orElseThrow(()->new UserNotFOUND("User with id"+ id + "not found"));
         if(userDTO.getUsername()!= null && !userDTO.getUsername().equals(user.getUsername())) {
             user.setUsername(userDTO.getUsername());
         }
         if(userDTO.getRoles()!= null){
             Set<Role> newRoles = new HashSet<>();
             for (String roleName: userDTO.getRoles()){
                 ERole eRole;
                 try {
                     eRole = ERole.valueOf(roleName);
                 }
                 catch (IllegalArgumentException e){
                     throw new IllegalArgumentException("Invalid Role of "+roleName);
                 }
                 Role role = roleRepository.findByName(eRole)
                 .orElseThrow(()-> new RuntimeException("Error:Role"+eRole+ " not found"));
                 newRoles.add(role);
                 }
             user.setRoles(newRoles);
             }
        Users updatedUser = userRepo.save(user);
         return new UserDTO(
                 updatedUser.getId(),
                 updatedUser.getUsername(),
                 updatedUser.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet())
         );
         }
         public void deleteUser(Long id){
        if(!userRepo.existsById(id)){
            throw new UserNotFOUND("User with id"+id+" not found");
        }
        userRepo.deleteById(id);
         }
    }


