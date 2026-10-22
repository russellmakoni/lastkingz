package com.lastKings.ecom.inventory_management.security;

import com.lastKings.ecom.inventory_management.model.Users;
import com.lastKings.ecom.inventory_management.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepo userRepo;

    public UserDetailsServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
      Users users = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User Not Found"+ username));
        return UserDetailsImpl.build(users) ;
    }
}
