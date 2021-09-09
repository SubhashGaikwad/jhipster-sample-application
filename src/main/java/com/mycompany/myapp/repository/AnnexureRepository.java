package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Annexure;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Annexure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnnexureRepository extends JpaRepository<Annexure, Long> {}
