package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Annexure;
import com.mycompany.myapp.repository.AnnexureRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Annexure}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnnexureResource {

    private final Logger log = LoggerFactory.getLogger(AnnexureResource.class);

    private static final String ENTITY_NAME = "annexure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnnexureRepository annexureRepository;

    public AnnexureResource(AnnexureRepository annexureRepository) {
        this.annexureRepository = annexureRepository;
    }

    /**
     * {@code POST  /annexures} : Create a new annexure.
     *
     * @param annexure the annexure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new annexure, or with status {@code 400 (Bad Request)} if the annexure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/annexures")
    public ResponseEntity<Annexure> createAnnexure(@RequestBody Annexure annexure) throws URISyntaxException {
        log.debug("REST request to save Annexure : {}", annexure);
        if (annexure.getId() != null) {
            throw new BadRequestAlertException("A new annexure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Annexure result = annexureRepository.save(annexure);
        return ResponseEntity
            .created(new URI("/api/annexures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /annexures/:id} : Updates an existing annexure.
     *
     * @param id the id of the annexure to save.
     * @param annexure the annexure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annexure,
     * or with status {@code 400 (Bad Request)} if the annexure is not valid,
     * or with status {@code 500 (Internal Server Error)} if the annexure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/annexures/{id}")
    public ResponseEntity<Annexure> updateAnnexure(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Annexure annexure
    ) throws URISyntaxException {
        log.debug("REST request to update Annexure : {}, {}", id, annexure);
        if (annexure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annexure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annexureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Annexure result = annexureRepository.save(annexure);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, annexure.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /annexures/:id} : Partial updates given fields of an existing annexure, field will ignore if it is null
     *
     * @param id the id of the annexure to save.
     * @param annexure the annexure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annexure,
     * or with status {@code 400 (Bad Request)} if the annexure is not valid,
     * or with status {@code 404 (Not Found)} if the annexure is not found,
     * or with status {@code 500 (Internal Server Error)} if the annexure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/annexures/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Annexure> partialUpdateAnnexure(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Annexure annexure
    ) throws URISyntaxException {
        log.debug("REST request to partial update Annexure partially : {}, {}", id, annexure);
        if (annexure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annexure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annexureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Annexure> result = annexureRepository
            .findById(annexure.getId())
            .map(
                existingAnnexure -> {
                    if (annexure.getType() != null) {
                        existingAnnexure.setType(annexure.getType());
                    }
                    if (annexure.getCompliance() != null) {
                        existingAnnexure.setCompliance(annexure.getCompliance());
                    }
                    if (annexure.getComment() != null) {
                        existingAnnexure.setComment(annexure.getComment());
                    }

                    return existingAnnexure;
                }
            )
            .map(annexureRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, annexure.getId().toString())
        );
    }

    /**
     * {@code GET  /annexures} : get all the annexures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of annexures in body.
     */
    @GetMapping("/annexures")
    public List<Annexure> getAllAnnexures() {
        log.debug("REST request to get all Annexures");
        return annexureRepository.findAll();
    }

    /**
     * {@code GET  /annexures/:id} : get the "id" annexure.
     *
     * @param id the id of the annexure to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the annexure, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/annexures/{id}")
    public ResponseEntity<Annexure> getAnnexure(@PathVariable Long id) {
        log.debug("REST request to get Annexure : {}", id);
        Optional<Annexure> annexure = annexureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(annexure);
    }

    /**
     * {@code DELETE  /annexures/:id} : delete the "id" annexure.
     *
     * @param id the id of the annexure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/annexures/{id}")
    public ResponseEntity<Void> deleteAnnexure(@PathVariable Long id) {
        log.debug("REST request to delete Annexure : {}", id);
        annexureRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
