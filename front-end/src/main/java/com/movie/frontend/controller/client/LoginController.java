package com.movie.frontend.controller.client;

import com.movie.frontend.model.*;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Set;

@Controller
@RequestMapping("")
@Slf4j
public class LoginController {

    @Autowired
    private UserService userService ;

    @PostMapping("/login")
    public String login(HttpServletRequest request,
                        RedirectAttributes redirectAttributes ,
                        HttpSession session ,
                        Model model
                        ) {

        AuthenticationRequest auth = new AuthenticationRequest();
        auth.setEmail(request.getParameter("email"));
        auth.setPassword(request.getParameter("password"));
        try{
            // API : AUTH_LOGIN
            JwtToken jwtToken = userService.login(auth);
            session.setAttribute("jwtToken" , jwtToken);
            session.setAttribute("fullName" , jwtToken.getUser().getFullName());
            UserDTO userDTO = jwtToken.getUser();
            if(userDTO.getRole().equals("ADMIN")) {
                return "redirect:/admin";
            }
            return "redirect:/";
        }catch (HttpClientErrorException e) {
            log.info(e.getResponseBodyAsString());
            redirectAttributes.addFlashAttribute("message" , "Mật khẩu hoặc tài khoản không hợp lệ") ;
            return "redirect:/login";
        }
    }




    @PostMapping("/profile")
    public String profile(HttpServletRequest request,
                        RedirectAttributes redirectAttributes ,
                        HttpSession session ,
                        Model model
    ) {

        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String phoneNumber = request.getParameter("phoneNumber");
        String password = request.getParameter("password");
        ProfileUpdateRequest profileUpdateRequest = new ProfileUpdateRequest(firstName, lastName, phoneNumber, password);
        try{
            JwtToken jwtToken = userService.updateProfile(profileUpdateRequest, session);
            session.setAttribute("jwtToken" , jwtToken);
            session.setAttribute("fullName" , jwtToken.getUser().getFullName());
            redirectAttributes.addFlashAttribute("messageSuccess", "Cap nhat thanh cong");
            return "redirect:/profile";
        }catch (HttpClientErrorException | JwtExpirationException e) {
            log.info(e.getMessage());
            redirectAttributes.addFlashAttribute("message" , "Mật khẩu hoặc tài khoản không hợp lệ") ;
            return "redirect:/login";
        }
    }

    @GetMapping("/authenticate")
    public String authenticateWithGoogle(
            @RequestParam("code") String code,
            HttpSession session
    ) {

        try{
            JwtToken jwtToken = userService.outboundUser(code);
            session.setAttribute("jwtToken" , jwtToken);
            session.setAttribute("fullName" , jwtToken.getUser().getFullName());
            return "redirect:/";
        }catch (HttpClientErrorException e) {
            log.info(e.getResponseBodyAsString());
            return "redirect:/login";
        }
    }

    @PostMapping("/register")
    public String register (HttpServletRequest request ,
                            RedirectAttributes redirectAttributes ,
                            HttpSession session) {
        RegisterRequest auth = new RegisterRequest();
        auth.setEmail(request.getParameter("email"));
        auth.setPassword(request.getParameter("password"));
        auth.setFirstName(request.getParameter("firstName"));
        auth.setLastName(request.getParameter("lastName"));

        try{
            String isSuccess = userService.register(auth) ;
            redirectAttributes.addFlashAttribute("message" , isSuccess);
            return "redirect:/register";
        }catch (HttpClientErrorException e) {
            log.info(e.getResponseBodyAsString());
            redirectAttributes.addFlashAttribute("message","Sai tài khoản hoặc mật khẩu");
            return "redirect:/register";
        }
    }

    @GetMapping("/verify")
    public String verifyCode(@RequestParam("code") String code ,
                             HttpSession session,
                             RedirectAttributes redirectAttributes){
        log.info(code);
        try {
            JwtToken jwtToken = userService.verify(code);
            if(jwtToken != null){
                log.info(jwtToken.getAccess_token());
                session.setAttribute("jwtToken" , jwtToken);
                session.setAttribute("fullName" , jwtToken.getUser().getFullName());
            }
            redirectAttributes.addFlashAttribute("message", "Bạn đã đăng kí thành công");
            return "redirect:/";
        } catch (HttpClientErrorException e) {
            redirectAttributes.addFlashAttribute("message",e.getResponseBodyAsString());
            return "redirect:/register";
        }
    }

    @GetMapping("/forgotPassword")
    public String goToPageForgot() {
        return "client/forgotPassword";
    }

    @PostMapping("/forgotPassword")
    public String forgotPassword(@RequestParam("email")String email, RedirectAttributes redirectAttributes) {
        String inform = userService.resetPassword(email);
        log.info(inform);
        redirectAttributes.addFlashAttribute("message",
                "Gửi yêu cầu thành công vui lòng check email") ;
        return "redirect:/forgotPassword";
    }
    @GetMapping("/reset_password")
    public String resetPassword(@RequestParam("token")String code , Model model) {
        try {
            String token = userService.verifyPassword(code) ;
            log.info(token);
            model.addAttribute("token" , token);
            model.addAttribute("messageSuccess", "Xác nhận email thành công");
            return "client/resetPassword";
        } catch (HttpClientErrorException e) {
            model.addAttribute("message",e.getResponseBodyAsString());
            return "client/resetPassword";
        }
    }
    @PostMapping("/confirmPassword")
    public String confirmPassword(RedirectAttributes redirectAttributes,
                                  @RequestParam("password")String password,
                                  @RequestParam("token") String token) {
//        log.info(password);
//        log.info(token);
        try {
            userService.confirmPassword(password, token);
            redirectAttributes.addFlashAttribute("messageSuccess" , "Lấy lại mật khẩu thành công");
            return "redirect:/login";
        } catch (HttpClientErrorException e) {
            redirectAttributes.addFlashAttribute("message" , e.getResponseBodyAsString());
            return "redirect:/login";
        }

    }



    @GetMapping("/logOut")
    public String logOut(HttpSession session, Model model) {
        try {
            userService.logout(session);
            session.removeAttribute("jwtToken");
            session.removeAttribute("fullName");
            model.addAttribute("message" , "Logout successful") ;
            return "redirect:/";
        } catch (JwtExpirationException e) {
            return "redirect:/login";
        }
    }
}
