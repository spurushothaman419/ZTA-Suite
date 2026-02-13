# ZTA Assessment Suite - Calculation Formulas Reference

## Quick Reference Guide for All Assessment Calculations

### 1. ZTA Maturity Model Scoring

#### Maturity Level Values
- **Traditional**: 1
- **Initial**: 2
- **Advanced**: 3
- **Optimal**: 4

#### Question Score
```
Score = Maturity Level Value (1-4)
```

#### Function Score
```
Function Score = Σ(Question Scores) / Number of Answered Questions in Function
```

#### Pillar Score
```
Pillar Score = Σ(All Question Scores in Pillar) / Number of Answered Questions in Pillar
```

#### Overall Maturity Score
```
Overall Score = Σ(All Question Scores) / Total Number of Answered Questions
```

#### Maturity Level Determination (from numeric score)
- **3.5 - 4.0** → Optimal
- **2.5 - 3.49** → Advanced
- **1.5 - 2.49** → Initial
- **1.0 - 1.49** → Traditional

---

### 2. Gap Analysis

#### Gap Calculation
```
Gap = Max(0, Target Score - Current Score)
```

#### Priority Assignment (based on Gap)
- **Gap ≥ 2.0** → Critical Priority
- **1.5 ≤ Gap < 2.0** → High Priority
- **0.5 ≤ Gap < 1.5** → Medium Priority
- **Gap < 0.5** → Low Priority

#### Overall Gap Metrics
```
Overall Gap = Target - Overall Score
Critical Gaps Count = Number of Pillars where Gap ≥ 2.0
High Gaps Count = Number of Pillars where Gap ≥ 1.5
```

---

### 3. Compliance Scoring

#### Control Status Values
- **Implemented**: 1.0 (full credit)
- **Partial**: 0.5 (half credit)
- **Not Implemented**: 0.0 (no credit)
- **Not Applicable**: Excluded from calculation

#### Framework Compliance Score
```
Total Points = Σ(Control Status Values)
Total Controls = Count of Applicable Controls
Compliance % = (Total Points / Total Controls) × 100
```

**Example:**
- 10 Implemented = 10 × 1.0 = 10 points
- 6 Partial = 6 × 0.5 = 3 points
- 4 Not Implemented = 4 × 0.0 = 0 points
- Total = 13 points out of 20 controls = 65% compliance

---

### 4. Phase & Task Progress

#### Task Status Types
- **Not Started**: Task not yet begun
- **In Progress**: Task actively being worked
- **Completed**: Task finished (counts toward completion)
- **Blocked**: Task blocked by dependencies

#### Phase Progress Calculation
```
Total Tasks = Count of All Tasks in Phase
Completed Tasks = Count of Tasks with Status "Completed"
Phase Progress % = (Completed Tasks / Total Tasks) × 100
```

#### Phase Statistics
```
Total = Count of all tasks
Completed = Count where status = "completed"
In Progress = Count where status = "in-progress"
Blocked = Count where status = "blocked"
```

---

### 5. Completion Metrics

#### Assessment Completion
```
Completion % = (Number of Answered Questions / Total Questions) × 100
```

#### Pillar Completion
```
Pillar Completion % = (Answered Questions in Pillar / Total Questions in Pillar) × 100
```

#### Alternative Overall Score (Pillar Average)
```
Average Pillar Score = Σ(All Pillar Scores) / Number of Pillars (8)
```

---

## Complete Worked Example

### Scenario: Identity Pillar Assessment
- Total Questions: 15
- Answered: 12 questions
- Distribution: 3 Traditional, 4 Initial, 3 Advanced, 2 Optimal

### Step-by-Step Calculations:

1. **Total Score**
   ```
   Total Score = (3 × 1) + (4 × 2) + (3 × 3) + (2 × 4)
   Total Score = 3 + 8 + 9 + 8 = 28
   ```

2. **Pillar Score**
   ```
   Pillar Score = 28 / 12 = 2.33
   ```

3. **Maturity Level**
   ```
   1.5 ≤ 2.33 < 2.5 → Initial
   ```

4. **Completion Percentage**
   ```
   Completion = (12 / 15) × 100 = 80%
   ```

5. **Gap to Target (Advanced = 3.0)**
   ```
   Gap = 3.0 - 2.33 = 0.67
   ```

6. **Priority Assignment**
   ```
   0.5 ≤ 0.67 < 1.5 → Medium Priority
   ```

---

## Important Notes

1. **Unanswered Questions**: Do not affect scores but reduce completion percentage
2. **Equal Weighting**: All pillars and functions weighted equally
3. **Linear Scale**: Equal intervals between maturity levels (1, 2, 3, 4)
4. **Rounding**: Display shows rounded percentages; calculations use full precision
5. **CISA Standards**: Based on CISA Zero Trust Maturity Model v2.0
6. **Partial Credit**: Compliance scoring awards 50% for partial implementation
7. **Auto-Priority**: Gap priority levels assigned automatically for consistency

---

## Formula Summary Table

| Metric | Formula | Range |
|--------|---------|-------|
| Question Score | Maturity Level Value | 1-4 |
| Function Score | Avg of Question Scores | 0-4 |
| Pillar Score | Avg of All Questions in Pillar | 0-4 |
| Overall Score | Avg of All Questions | 0-4 |
| Gap | Max(0, Target - Current) | 0-4 |
| Compliance % | (Points / Controls) × 100 | 0-100% |
| Phase Progress % | (Completed / Total) × 100 | 0-100% |
| Completion % | (Answered / Total) × 100 | 0-100% |

---

## Framework Structure

```
ZTA Assessment
├── 8 Pillars (Identity, Devices, Networks, etc.)
│   ├── Multiple Functions per Pillar
│   │   ├── Multiple Questions per Function
│   │   │   └── Each Question has 4 Maturity Indicators
```

**Total Assessment:**
- 8 Pillars
- ~3-6 Functions per Pillar
- ~2-4 Questions per Function
- ~150+ Total Questions

---

*This document provides a comprehensive reference for all calculations used throughout the ZTA Assessment Suite. For detailed explanations and examples, see the "Methodology" tab in the application.*
