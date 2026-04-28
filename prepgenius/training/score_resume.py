import json
import sys
from pathlib import Path

import joblib
import numpy as np

DEFAULT_MODEL = Path(__file__).resolve().parent / "artifacts" / "resume_score_model.joblib"


def load_payload() -> dict:
    raw = sys.stdin.read()
    if not raw:
        return {}
    return json.loads(raw)


def main() -> None:
    payload = load_payload()
    resume_text = str(payload.get("resumeText", ""))
    jd_hints = str(payload.get("jdHints", ""))

    model_path = Path(payload.get("modelPath", DEFAULT_MODEL))
    if not model_path.exists():
        print(json.dumps({"error": "model_not_found"}))
        return

    model = joblib.load(model_path)
    combined_text = f"{resume_text} {jd_hints}".strip()
    score = float(np.clip(model.predict([combined_text])[0], 0, 100))

    print(json.dumps({"score": round(score, 2), "modelPath": str(model_path)}))


if __name__ == "__main__":
    main()
