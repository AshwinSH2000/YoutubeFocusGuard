from sentence_transformers import SentenceTransformer
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import time

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

TECH_EXAMPLES = [
    # General programming & CS
    "software engineering",
    "computer science",
    "programming concepts",
    "coding fundamentals",
    "data structures and algorithms",
    "system design",

    # Courses / tutorials / learning formats
    "programming tutorial",
    "coding course",
    "software development course",
    "learn programming from scratch",
    "full stack development tutorial",
    "backend development tutorial",

    # Languages & frameworks (high-signal)
    "python programming",
    "django web development",
    "fastapi backend",
    "javascript development",
    "api development",
    "rest api design",

    # ML / AI (modern phrasing)
    "machine learning",
    "deep learning",
    "reinforcement learning",
    "artificial intelligence",
    "llm fundamentals",
    "neural networks explained",

    # Infrastructure / systems
    "distributed systems",
    "operating systems",
    "database systems",
    "scalable backend architecture",
    "cloud computing basics",

    # Interview / career
    "coding interview preparation",
    "software engineering interview",
    "system design interview",

    # Real-world dev phrasing
    "build an api",
    "backend project walkthrough",
    "software project tutorial"
]


TECH_EMBEDDINGS = model.encode(TECH_EXAMPLES, normalize_embeddings=True)

def cosine_similarity(a, b):
    return np.dot(a, b)


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

# @app.post("/classify")
# def classify_video(data: VideoRequest):
#     title = data.title.lower()

#     tech_keywords = [
#         "dsa", "algorithm", "data structure", "computer",
#         "programming", "coding", "development", "system design",
#         "optimization", "ai", "machine learning"
#     ]
#     #this is still not using AI. will implement it in next few days
#     is_tech = any(keyword in title for keyword in tech_keywords)

#     return {
#         "category": "TECH" if is_tech else "NON_TECH",
#         "confidence": "low (keyword-based)"
#     }




@app.post("/classify")
def classify_video(data: VideoRequest):
    title = data.title.strip().lower()

    if not title:
        return {"category": "TECH", "confidence": 1.0}

    title_embedding = model.encode([title], normalize_embeddings=True)[0]

    similarities = [
        cosine_similarity(title_embedding, tech_emb)
        for tech_emb in TECH_EMBEDDINGS
    ]

    max_similarity = max(similarities)

    THRESHOLD = 0.55  
    KEYWORD_THRESHOLD = 0.35    #rough estimate for now. to be tuned

    if max_similarity >= THRESHOLD:
        return {
            "category": "TECH",
            "confidence": str(round(float(max_similarity), 3))+" (high->embedding-based)"
        }
    elif max_similarity >= KEYWORD_THRESHOLD:
        tech_keywords = [
            "dsa", "algorithm", "data structure", "computer",
            "programming", "coding", "development", "system design",
            "optimization", "ai", "machine learning"
        ]
        is_tech = any(keyword in title for keyword in tech_keywords)
        return {
            "category": "TECH" if is_tech else "NON_TECH",
            "confidence": str(round(float(max_similarity), 3))+" (low->keyword-based)"
        }
    else:
        return {
            "category": "NON_TECH",
            "confidence": str(round(float(max_similarity), 3))+" (low->embedding-based)"
        }
