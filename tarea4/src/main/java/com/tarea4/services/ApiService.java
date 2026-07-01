package com.tarea4.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.tarea4.models.Actividad;
import com.tarea4.models.ActividadRepository;
import com.tarea4.models.Nota;
import com.tarea4.models.NotaRepository;

@Service
public class ApiService {
    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ApiService(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    public List<Map<String, String>> buscarActividades(String busqueda) {
        List<Map<String, String>> resultado = new ArrayList<>();

        if (busqueda == null || busqueda.trim().length() < 3) {
            return resultado;
        }

        String patron = busqueda.trim().toLowerCase();
        List<Actividad> actividades = actividadRepository.findAll();

        for (Actividad actividad : actividades) {
            String nombre = normalizar(actividad.getNombre());
            String descripcion = normalizar(actividad.getDescripcion());
            String comuna = normalizar(actividad.getMiembro().getComuna().getNombre());

            if (nombre.contains(patron) || descripcion.contains(patron) || comuna.contains(patron)) {
                resultado.add(serializarActividad(actividad));
            }
        }

        return resultado;
    }

    public Map<String, String> agregarNota(Integer actividadId, Object notaValor) {
        Actividad actividad = actividadRepository.findById(actividadId).orElse(null);

        if (actividad == null) {
            throw new IllegalArgumentException("Actividad no encontrada.");
        }

        Integer notaInt = convertirNota(notaValor);

        if (notaInt == null || notaInt < 1 || notaInt > 7) {
            throw new IllegalArgumentException("La nota debe ser un numero entero entre 1 y 7.");
        }

        Nota nota = new Nota(actividad, notaInt);
        notaRepository.save(nota);

        Map<String, String> resumen = obtenerResumenNota(actividadId);
        resumen.put("mensaje", "Nota agregada correctamente.");

        return resumen;
    }

    private Map<String, String> serializarActividad(Actividad actividad) {
        Map<String, String> data = new HashMap<>();
        Map<String, String> resumen = obtenerResumenNota(actividad.getId());

        data.put("id", actividad.getId().toString());
        data.put("miembro", actividad.getMiembro().getNombre());
        data.put("dia", actividad.getDia());
        data.put("tipo", actividad.getTipo());
        data.put("comuna", actividad.getMiembro().getComuna().getNombre());
        data.put("nombre", actividad.getNombre());
        data.put("descripcion", actividad.getDescripcion());
        data.put("nota", resumen.get("nota"));
        data.put("cantidad_notas", resumen.get("cantidad_notas"));

        return data;
    }

    private Map<String, String> obtenerResumenNota(Integer actividadId) {
        List<Nota> notas = notaRepository.findByActividad_Id(actividadId);
        Map<String, String> resumen = new HashMap<>();

        if (notas.isEmpty()) {
            resumen.put("nota", "-");
            resumen.put("cantidad_notas", "0");
            return resumen;
        }

        Integer suma = 0;

        for (Nota nota : notas) {
            suma += nota.getNota();
        }

        Double promedio = suma.doubleValue() / notas.size();

        resumen.put("nota", String.format(Locale.US, "%.1f", promedio));
        resumen.put("cantidad_notas", String.valueOf(notas.size()));

        return resumen;
    }

    private Integer convertirNota(Object valor) {
        if (valor instanceof Integer) {
            return (Integer) valor;
        }

        if (valor instanceof Number) {
            Double numero = ((Number) valor).doubleValue();

            if (numero % 1 == 0) {
                return numero.intValue();
            }
        }

        if (valor instanceof String) {
            String texto = ((String) valor).trim();

            if (texto.matches("\\d+")) {
                return Integer.parseInt(texto);
            }
        }

        return null;
    }

    private String normalizar(String texto) {
        return texto == null ? "" : texto.toLowerCase();
    }
}