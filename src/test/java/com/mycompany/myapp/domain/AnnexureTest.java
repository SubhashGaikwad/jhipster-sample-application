package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnnexureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Annexure.class);
        Annexure annexure1 = new Annexure();
        annexure1.setId(1L);
        Annexure annexure2 = new Annexure();
        annexure2.setId(annexure1.getId());
        assertThat(annexure1).isEqualTo(annexure2);
        annexure2.setId(2L);
        assertThat(annexure1).isNotEqualTo(annexure2);
        annexure1.setId(null);
        assertThat(annexure1).isNotEqualTo(annexure2);
    }
}
