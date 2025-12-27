from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class VideoRequest(BaseModel):
    title: str

@app.get("/")
def health_check():
    return {"status": "Backend running"}

@app.post("/classify")

def classify_video(data: VideoRequest):
    title = data.title.lower()

    tech_keywords = [
        "dsa", "algorithm", "data structure", "computer",
        "programming", "coding", "development", "system design",
        "optimization", "ai", "machine learning"
    ]

    is_tech = any(keyword in title for keyword in tech_keywords)

    return {
        "category": "TECH" if is_tech else "NON_TECH",
        "confidence": "low (keyword-based)"
    }
