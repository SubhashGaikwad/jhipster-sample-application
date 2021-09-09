package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Annexure.
 */
@Entity
@Table(name = "annexure")
public class Annexure implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "compliance")
    private Boolean compliance;

    @Column(name = "comment")
    private String comment;

    @OneToMany(mappedBy = "annexure")
    @JsonIgnoreProperties(value = { "annexure" }, allowSetters = true)
    private Set<Question> questions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Annexure id(Long id) {
        this.id = id;
        return this;
    }

    public String getType() {
        return this.type;
    }

    public Annexure type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getCompliance() {
        return this.compliance;
    }

    public Annexure compliance(Boolean compliance) {
        this.compliance = compliance;
        return this;
    }

    public void setCompliance(Boolean compliance) {
        this.compliance = compliance;
    }

    public String getComment() {
        return this.comment;
    }

    public Annexure comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Set<Question> getQuestions() {
        return this.questions;
    }

    public Annexure questions(Set<Question> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Annexure addQuestion(Question question) {
        this.questions.add(question);
        question.setAnnexure(this);
        return this;
    }

    public Annexure removeQuestion(Question question) {
        this.questions.remove(question);
        question.setAnnexure(null);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setAnnexure(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setAnnexure(this));
        }
        this.questions = questions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Annexure)) {
            return false;
        }
        return id != null && id.equals(((Annexure) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Annexure{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", compliance='" + getCompliance() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
