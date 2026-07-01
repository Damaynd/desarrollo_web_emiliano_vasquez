package com.tarea4.models;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByActividad_Id(Integer actividadId);
}