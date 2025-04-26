package com.ds39.mastermind.model.skill;

import com.ds39.mastermind.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTag extends BaseEntity {

    @Column(name = "tag_name", nullable = false)
    private String tagName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "usage_count")
    private Long usageCount = 0L;

    @Column(name = "is_trending")
    private Boolean isTrending = false;
}