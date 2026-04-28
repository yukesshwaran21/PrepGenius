import argparse
import json
import re
from pathlib import Path
from typing import Iterable, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

DEFAULT_INPUT = Path(__file__).resolve().parents[2] / "resume_data.csv"
DEFAULT_MODEL_DIR = Path(__file__).resolve().parent / "artifacts"

TARGET_COLUMN = "matched_score"

RESUME_COLUMNS = [
    "address",
    "career_objective",
    "skills",
    "educational_institution_name",
    "degree_names",
    "passing_years",
    "educational_results",
    "result_types",
    "major_field_of_studies",
    "professional_company_names",
    "company_urls",
    "start_dates",
    "end_dates",
    "related_skils_in_job",
    "positions",
    "locations",
    "responsibilities",
    "extra_curricular_activity_types",
    "extra_curricular_organization_names",
    "extra_curricular_organization_links",
    "role_positions",
    "languages",
    "proficiency_levels",
    "certification_providers",
    "certification_skills",
    "online_links",
    "issue_dates",
    "expiry_dates",
]

JOB_COLUMNS = [
    "job_position_name",
    "educationaL_requirements",
    "experiencere_requirement",
    "age_requirement",
    "responsibilities.1",
    "skills_required",
]

NUMERIC_FEATURES = [
    "resume_word_count",
    "resume_avg_word_len",
    "resume_sentence_count",
    "resume_avg_sentence_len",
    "resume_newline_count",
    "resume_bullet_like_count",
    "resume_uppercase_ratio",
    "resume_digit_ratio",
    "resume_section_hits",
    "job_word_count",
    "job_avg_word_len",
    "keyword_overlap_ratio",
    "keyword_jaccard",
    "skills_overlap_ratio",
    "position_count",
    "start_year_span",
]

SECTION_KEYWORDS = [
    "experience",
    "education",
    "skills",
    "projects",
    "certification",
    "summary",
    "objective",
]

TOKEN_RE = re.compile(r"[A-Za-z0-9+#]+")
YEAR_RE = re.compile(r"(19\d{2}|20\d{2})")


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(col).strip().lstrip("\ufeff") for col in df.columns]
    return df


def safe_tokens(text: str) -> List[str]:
    return TOKEN_RE.findall(text.lower())


def parse_list_field(value: str) -> List[str]:
    if not isinstance(value, str):
        return []
    cleaned = value.strip()
    if not cleaned:
        return []
    if cleaned.startswith("[") and cleaned.endswith("]"):
        cleaned = cleaned[1:-1]
    parts = re.split(r"[,;\n\t]+", cleaned)
    items = [part.strip(" '[]\"") for part in parts]
    return [item for item in items if item]


def join_columns(df: pd.DataFrame, columns: Iterable[str]) -> pd.Series:
    available = [col for col in columns if col in df.columns]
    if not available:
        return pd.Series([""] * len(df))
    return df[available].fillna("").astype(str).agg(" ".join, axis=1)


def text_stats(text: str) -> Tuple[int, float, int, float, int, int, float, float, int]:
    tokens = safe_tokens(text)
    word_count = len(tokens)
    avg_word_len = float(np.mean([len(token) for token in tokens])) if tokens else 0.0
    sentence_count = max(1, len([s for s in re.split(r"[.!?]+", text) if s.strip()]))
    avg_sentence_len = word_count / max(1, sentence_count)
    newline_count = text.count("\n")
    bullet_like_count = text.count("\n") + text.count("\u2022")
    alpha_chars = [c for c in text if c.isalpha()]
    uppercase_ratio = (
        sum(1 for c in alpha_chars if c.isupper()) / max(1, len(alpha_chars))
    )
    digit_ratio = sum(1 for c in text if c.isdigit()) / max(1, len(text))
    section_hits = sum(1 for key in SECTION_KEYWORDS if key in text.lower())
    return (
        word_count,
        avg_word_len,
        sentence_count,
        avg_sentence_len,
        newline_count,
        bullet_like_count,
        uppercase_ratio,
        digit_ratio,
        section_hits,
    )


def extract_year_span(values: Iterable[str]) -> int:
    years: List[int] = []
    for value in values:
        if not isinstance(value, str):
            continue
        for match in YEAR_RE.findall(value):
            years.append(int(match))
    if not years:
        return 0
    return max(years) - min(years)


def build_numeric_features(df: pd.DataFrame, resume_text: pd.Series, job_text: pd.Series) -> pd.DataFrame:
    features = []
    for idx, (resume, job) in enumerate(zip(resume_text, job_text)):
        resume_stats = text_stats(resume)
        job_stats = text_stats(job)
        resume_tokens = set(safe_tokens(resume))
        job_tokens = set(safe_tokens(job))
        intersection = resume_tokens.intersection(job_tokens)
        union = resume_tokens.union(job_tokens)
        keyword_overlap_ratio = len(intersection) / max(1, len(job_tokens))
        keyword_jaccard = len(intersection) / max(1, len(union))

        skills_resume = parse_list_field(df.get("skills", pd.Series([""] * len(df))).iloc[idx])
        skills_required = parse_list_field(
            df.get("skills_required", pd.Series([""] * len(df))).iloc[idx]
        )
        skills_resume_set = {skill.lower() for skill in skills_resume}
        skills_required_set = {skill.lower() for skill in skills_required}
        skills_overlap_ratio = (
            len(skills_resume_set.intersection(skills_required_set))
            / max(1, len(skills_required_set))
        )

        positions = parse_list_field(df.get("positions", pd.Series([""] * len(df))).iloc[idx])
        position_count = len(positions)

        start_dates = parse_list_field(df.get("start_dates", pd.Series([""] * len(df))).iloc[idx])
        end_dates = parse_list_field(df.get("end_dates", pd.Series([""] * len(df))).iloc[idx])
        year_span = extract_year_span(start_dates + end_dates)

        features.append(
            list(resume_stats)
            + [job_stats[0], job_stats[1]]
            + [keyword_overlap_ratio, keyword_jaccard, skills_overlap_ratio, position_count, year_span]
        )

    return pd.DataFrame(features, columns=NUMERIC_FEATURES)


def coerce_target(series: pd.Series) -> np.ndarray:
    numeric = pd.to_numeric(series, errors="coerce")
    numeric = numeric.fillna(numeric.median())
    max_val = numeric.max()
    if max_val <= 1.5:
        return (numeric * 100.0).clip(0, 100).to_numpy()
    return numeric.clip(0, 100).to_numpy()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--model-dir", type=Path, default=DEFAULT_MODEL_DIR)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    args = parser.parse_args()

    df = pd.read_csv(args.input, encoding="utf-8-sig")
    df = normalize_columns(df)
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing target column: {TARGET_COLUMN}")

    resume_text = join_columns(df, RESUME_COLUMNS)
    job_text = join_columns(df, JOB_COLUMNS)
    numeric_features = build_numeric_features(df, resume_text, job_text)

    y = coerce_target(df[TARGET_COLUMN])
    feature_frame = pd.DataFrame({
        "resume_text": resume_text,
        "job_text": job_text,
    })
    feature_frame = pd.concat([feature_frame, numeric_features], axis=1)

    X_train, X_test, y_train, y_test = train_test_split(
        feature_frame, y, test_size=args.test_size, random_state=args.random_state
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "resume_tfidf",
                TfidfVectorizer(max_features=7000, ngram_range=(1, 2), min_df=2),
                "resume_text",
            ),
            (
                "job_tfidf",
                TfidfVectorizer(max_features=4000, ngram_range=(1, 2), min_df=2),
                "job_text",
            ),
            ("num", StandardScaler(), NUMERIC_FEATURES),
        ],
        remainder="drop",
        sparse_threshold=0.2,
    )

    model = Pipeline(
        steps=[
            ("features", preprocessor),
            ("regressor", Ridge(alpha=1.0)),
        ]
    )

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    predictions = np.clip(predictions, 0, 100)

    mse = mean_squared_error(y_test, predictions)
    metrics = {
        "mae": float(mean_absolute_error(y_test, predictions)),
        "rmse": float(np.sqrt(mse)),
        "r2": float(r2_score(y_test, predictions)),
        "sample_count": int(len(df)),
    }

    args.model_dir.mkdir(parents=True, exist_ok=True)
    model_path = args.model_dir / "resume_score_model.joblib"
    metrics_path = args.model_dir / "metrics.json"
    config_path = args.model_dir / "feature_config.json"

    joblib.dump(model, model_path)
    metrics_path.write_text(json.dumps(metrics, indent=2))
    config_path.write_text(
        json.dumps(
            {
                "resume_columns": RESUME_COLUMNS,
                "job_columns": JOB_COLUMNS,
                "numeric_features": NUMERIC_FEATURES,
            },
            indent=2,
        )
    )

    print("Training complete")
    print(f"Model saved to: {model_path}")
    print(f"Metrics saved to: {metrics_path}")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
