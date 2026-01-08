from fastapi import FastAPI
from pydantic import BaseModel
import time
app = FastAPI()

class VideoRequest(BaseModel):
    title: str

start_time = time.time()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "uptime": time.time() - start_time 
    }

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
    #this is still not using AI. will implement it in next few days
    is_tech = any(keyword in title for keyword in tech_keywords)

    return {
        "category": "TECH" if is_tech else "NON_TECH",
        "confidence": "low (keyword-based)"
    }
