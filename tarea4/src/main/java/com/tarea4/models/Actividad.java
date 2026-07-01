package com.tarea4.models;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "actividad")

public class Actividad {
    
    @Id
    private Integer id;

    private String dia;

    @Column(name = "hora_inicio")
    private String horaInicio;

    private String duracion;

    private String tipo;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "miembro_id")

    private Miembro miembro;

    public Actividad() {
    }

    public Integer getId() {
        return id;
    }

    public String getDia() {
        return dia;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public String getDuracion() {
        return duracion;
    }

    public String getTipo() {
        return tipo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Miembro getMiembro() {
        return miembro;
    }
}