package com.tarea4.controllers;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tarea4.services.ApiService;

@RestController
public class ApiController {
    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/api/actividades/buscar")
    public Map<String, List<Map<String, Object>>> buscarActividadesEndpoint(@RequestParam("q") String busqueda) {
        List<Map<String, Object>> actividades = apiService.buscarActividades(busqueda);
        return Map.of("actividades", actividades);
    }

    @PostMapping("/api/actividades/{id}/notas")
    public ResponseEntity<Map<String, String>> agregarNotaEndpoint(
        @PathVariable("id") Integer actividadId,
        @RequestBody Map<String, Object> body) {

        try {
            Map<String, String> respuesta = apiService.agregarNota(actividadId, body.get("nota"));
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("error", error.getMessage()));
        }
    }
}
