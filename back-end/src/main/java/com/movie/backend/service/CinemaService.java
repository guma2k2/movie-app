package com.movie.backend.service;

import com.cloudinary.Cloudinary;
import com.movie.backend.dto.CinemaDTO;
import com.movie.backend.entity.*;
import com.movie.backend.exception.CinemaException;
import com.movie.backend.exception.MovieException;
import com.movie.backend.repository.CinemaImageRepository;
import com.movie.backend.repository.CinemaRepository;
import com.movie.backend.repository.EventRepository;
import com.movie.backend.ultity.FileUploadUtil;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CinemaService {

    @Autowired
    private EventRepository eventRepository ;

    @Autowired
    private CinemaImageRepository cinemaImageRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private Cloudinary cloudinary;

    public List<CinemaDTO> findByDateAndCity( LocalDate date ,
                                              String cityName ,
                                              Long movieId ,
                                              String subType)  {


        if(date == null || cityName == null || cityName == null) {
            throw new CinemaException("Date, cityName , subType cannot be null");
        }
        // Get list cinema base on these params
        List<Cinema> cinemas = eventRepository
                .findByDateAndCity(date,cityName, movieId , subType)
                .stream()
                .map(event -> event.getRoom().getCinema())
                .distinct()
                .collect(Collectors.toList());

        return  cinemas
                .stream()
                .map(cinema -> {
                    CinemaDTO cinemaDTO = modelMapper.map(cinema, CinemaDTO.class);
                    return cinemaDTO;
                })
                .collect(Collectors.toList());
    }

    public List<CinemaDTO> findByCity(Integer cityId) {
        if (cityId == null) {
            throw  new CinemaException("The id of city not found");
        }
        return cinemaRepository.findByCity(cityId)
                .stream()
                .map(cinema -> modelMapper.map(cinema, CinemaDTO.class))
                .collect(Collectors.toList());
    }

    public List<CinemaDTO> findAll() {
        return cinemaRepository.findAll()
                .stream()
                .map(cinema -> modelMapper.map(cinema, CinemaDTO.class))
                .collect(Collectors.toList());
    }
    public Cinema saveCinema(CinemaDTO cinemaDTO, Long cinemaId) {

        boolean update = cinemaId != null ;
        Cinema checkCinema = cinemaRepository.findByName(cinemaDTO.getName()) ;
        if(update) {
            if(checkCinema != null ) {
                if (checkCinema.getId() != cinemaId) {
//                    log.info(String.valueOf(cinemaId));
//                    log.info(String.valueOf(checkCinema.getId()));
                    throw new CinemaException("Name of cinema  not valid") ;
                }
            }
        } else {
            if (checkCinema != null) {
                throw new CinemaException("Name of cinema  not valid") ;
            }
        }

        String name = cinemaDTO.getName() ;
        String address = cinemaDTO.getAddress();
        String phone_number = cinemaDTO.getPhone_number();
        String cinemaType = cinemaDTO.getCinema_type() ;
        City city = modelMapper.map(cinemaDTO.getCity(), City.class) ;

        if(update) {
            Cinema oldCinema =   cinemaRepository.findById(cinemaId).get() ;
            oldCinema.setName(name);
            oldCinema.setAddress(address);
            oldCinema.setPhone_number(phone_number);
            oldCinema.setCinema_type(cinemaType);
            oldCinema.setCity(city);
            return cinemaRepository.save(oldCinema) ;
        }
        Cinema newCinema = Cinema.builder()
                .name(name)
                .address(address)
                .phone_number(phone_number)
                .cinema_type(cinemaType)
                .city(city)
                .build();
        return cinemaRepository.save(newCinema) ;
    }
    public CinemaDTO get(Long cinemaId) {
        if (cinemaId == null) {
            throw  new CinemaException("The id of cinema not found");
        }
        Cinema cinema = cinemaRepository.findById(cinemaId).orElseThrow(() -> new CinemaException("Cinema not found !!")) ;
        return modelMapper.map(cinema, CinemaDTO.class) ;
    }

    public void saveImages(MultipartFile mainImageMultipart, MultipartFile[] extraImageMultiparts, String[] imageIDs, String[] imageNames, Long cinemaId) throws IOException {
        Cinema cinema = cinemaRepository.findById(cinemaId).orElseThrow(() -> new CinemaException("Cinema not found"));
        setMainImageName(mainImageMultipart, cinema);
        setExistingExtraImageNames(imageIDs, imageNames, cinema);
        setNewExtraImageNames(extraImageMultiparts, cinema);
        cinemaRepository.save(cinema);

    }




    private void setNewExtraImageNames(MultipartFile[] extraImageMultiparts, Cinema cinema) {
        if (extraImageMultiparts.length > 0) {
            for (MultipartFile multipartFile : extraImageMultiparts) {
                if (!multipartFile.isEmpty()) {
                    HashMap<String, String> map = new HashMap<>();
                    String fileId = UUID.randomUUID().toString();
                    map.put("public_id", fileId);
                    map.put("resource_type", "auto");
                    Map uploadResult = null;
                    try {
                        uploadResult = cloudinary.uploader()
                                .upload(multipartFile.getBytes(), map);
                    } catch (IOException e) {
                        log.error(e.getMessage());
                    }
                    String url = uploadResult
                            .get("url")
                            .toString();

                    if (!cinema.containsImageName(url)) {
                        cinema.addExtraImage(url);
                    }
                }
            }
        }
    }

    private void setExistingExtraImageNames(String[] imageIDs, String[] imageNames, Cinema cinema) {
        if (imageIDs == null || imageIDs.length == 0) return;

        Set<CinemaImage> images = new HashSet<>();

        for (int count = 0; count < imageIDs.length; count++) {
            Long id = Long.parseLong(imageIDs[count]);
            String name = imageNames[count];

            images.add(new CinemaImage(id, name, cinema));
        }
        cinema.setImages(images);
    }

    private void setMainImageName(MultipartFile mainImageMultipart, Cinema cinema) {
        if (!mainImageMultipart.isEmpty()) {

            HashMap<String, String> map = new HashMap<>();
            String fileId = UUID.randomUUID().toString();
            map.put("public_id", fileId);
            map.put("resource_type", "auto");
            Map uploadResult = null;
            try {
                uploadResult = cloudinary.uploader()
                        .upload(mainImageMultipart.getBytes(), map);
            } catch (IOException e) {
                log.error(e.getMessage());
            }
            String url = uploadResult
                    .get("url")
                    .toString();
            cinema.setImage_url(url);
        }

    }
}
