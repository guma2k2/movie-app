package com.movie.backend.repository;

import com.movie.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository  extends JpaRepository<Booking,Long> {

    @Query("SELECT b FROM Booking b " +
            "INNER JOIN b.event e " +
            "WHERE e.id = :eventId")
    public List<Booking> listBookingByEvent(@Param("eventId")Long eventId);

    @Modifying
    @Query("DELETE FROM Booking b WHERE b.id = :id")
    public void deleteBookingById(@Param("id") Long bookingId);

    @Query("SELECT b FROM Booking b WHERE DAY(b.created_time) = DAY(CURRENT_DATE) " +
            "AND b.id NOT IN (SELECT t.booking.id FROM Ticket t)")
    public List<Booking> findAllBookingByDay() ;
}
