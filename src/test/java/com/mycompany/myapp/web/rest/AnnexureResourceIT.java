package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Annexure;
import com.mycompany.myapp.repository.AnnexureRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AnnexureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnnexureResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_COMPLIANCE = false;
    private static final Boolean UPDATED_COMPLIANCE = true;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/annexures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnnexureRepository annexureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnnexureMockMvc;

    private Annexure annexure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Annexure createEntity(EntityManager em) {
        Annexure annexure = new Annexure().type(DEFAULT_TYPE).compliance(DEFAULT_COMPLIANCE).comment(DEFAULT_COMMENT);
        return annexure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Annexure createUpdatedEntity(EntityManager em) {
        Annexure annexure = new Annexure().type(UPDATED_TYPE).compliance(UPDATED_COMPLIANCE).comment(UPDATED_COMMENT);
        return annexure;
    }

    @BeforeEach
    public void initTest() {
        annexure = createEntity(em);
    }

    @Test
    @Transactional
    void createAnnexure() throws Exception {
        int databaseSizeBeforeCreate = annexureRepository.findAll().size();
        // Create the Annexure
        restAnnexureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(annexure)))
            .andExpect(status().isCreated());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeCreate + 1);
        Annexure testAnnexure = annexureList.get(annexureList.size() - 1);
        assertThat(testAnnexure.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAnnexure.getCompliance()).isEqualTo(DEFAULT_COMPLIANCE);
        assertThat(testAnnexure.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createAnnexureWithExistingId() throws Exception {
        // Create the Annexure with an existing ID
        annexure.setId(1L);

        int databaseSizeBeforeCreate = annexureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnnexureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(annexure)))
            .andExpect(status().isBadRequest());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAnnexures() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        // Get all the annexureList
        restAnnexureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(annexure.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].compliance").value(hasItem(DEFAULT_COMPLIANCE.booleanValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getAnnexure() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        // Get the annexure
        restAnnexureMockMvc
            .perform(get(ENTITY_API_URL_ID, annexure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(annexure.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.compliance").value(DEFAULT_COMPLIANCE.booleanValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingAnnexure() throws Exception {
        // Get the annexure
        restAnnexureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAnnexure() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();

        // Update the annexure
        Annexure updatedAnnexure = annexureRepository.findById(annexure.getId()).get();
        // Disconnect from session so that the updates on updatedAnnexure are not directly saved in db
        em.detach(updatedAnnexure);
        updatedAnnexure.type(UPDATED_TYPE).compliance(UPDATED_COMPLIANCE).comment(UPDATED_COMMENT);

        restAnnexureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnnexure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnnexure))
            )
            .andExpect(status().isOk());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
        Annexure testAnnexure = annexureList.get(annexureList.size() - 1);
        assertThat(testAnnexure.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAnnexure.getCompliance()).isEqualTo(UPDATED_COMPLIANCE);
        assertThat(testAnnexure.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, annexure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(annexure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(annexure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(annexure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnnexureWithPatch() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();

        // Update the annexure using partial update
        Annexure partialUpdatedAnnexure = new Annexure();
        partialUpdatedAnnexure.setId(annexure.getId());

        restAnnexureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnexure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnnexure))
            )
            .andExpect(status().isOk());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
        Annexure testAnnexure = annexureList.get(annexureList.size() - 1);
        assertThat(testAnnexure.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAnnexure.getCompliance()).isEqualTo(DEFAULT_COMPLIANCE);
        assertThat(testAnnexure.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateAnnexureWithPatch() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();

        // Update the annexure using partial update
        Annexure partialUpdatedAnnexure = new Annexure();
        partialUpdatedAnnexure.setId(annexure.getId());

        partialUpdatedAnnexure.type(UPDATED_TYPE).compliance(UPDATED_COMPLIANCE).comment(UPDATED_COMMENT);

        restAnnexureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnnexure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnnexure))
            )
            .andExpect(status().isOk());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
        Annexure testAnnexure = annexureList.get(annexureList.size() - 1);
        assertThat(testAnnexure.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAnnexure.getCompliance()).isEqualTo(UPDATED_COMPLIANCE);
        assertThat(testAnnexure.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, annexure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(annexure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(annexure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnnexure() throws Exception {
        int databaseSizeBeforeUpdate = annexureRepository.findAll().size();
        annexure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnnexureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(annexure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Annexure in the database
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnnexure() throws Exception {
        // Initialize the database
        annexureRepository.saveAndFlush(annexure);

        int databaseSizeBeforeDelete = annexureRepository.findAll().size();

        // Delete the annexure
        restAnnexureMockMvc
            .perform(delete(ENTITY_API_URL_ID, annexure.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Annexure> annexureList = annexureRepository.findAll();
        assertThat(annexureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
