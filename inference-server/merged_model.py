# Use a pipeline as a high-level helper
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Define allowed origins
origins = [
    "http://localhost:3000",  # Example: Frontend running on a different port
    "https://example.com",    # Example: Your production domain
    "*",                      # Allow all origins (not recommended for production)
]

# pipe = pipeline("text-generation", model="minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-Capybara", device=0)
# pipe = pipeline("text-generation", model="minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-FineTome-100K", device=0)
# pipe = pipeline("text-generation", model="unsloth/Llama-3.2-1B-Instruct", device=0)
# pipe = pipeline("text-generation", model="unsloth/Qwen2.5-0.5B-Instruct", device=0)
pipe = pipeline("text-generation", model="minhnguyen5293/merged_16bit_1_full_epoch", device=0)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

# Define the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                # List of allowed origins
    allow_credentials=True,               # Allow cookies and other credentials
    allow_methods=["*"],                  # Allow all HTTP methods
    allow_headers=["*"],                  # Allow all headers
)

# Request body model [{"role": "user", "content": "Who are you?"}]
class Messages(BaseModel):
    role: str
    content: str

@app.post("/chat/")
async def chat(messages: list[Messages]):
    """
    Endpoint for generating a response from the pipeline.
    """
    print(messages)
    # parse messages to list of dictionaries
    messages = [{"role": msg.role, "content": msg.content} for msg in messages]
    try:
        # Get response from the pipeline
        response = pipe(messages, max_new_tokens=1024)
        
        # Extract and return the generated text
        generated_text = response[0]['generated_text'][-1]['content']
        return {"assistant": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
