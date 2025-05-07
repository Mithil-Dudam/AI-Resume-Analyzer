from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    resume:str
    job_description:str

template = """
You are an AI assistant that evaluates how well a candidate's resume matches a given job description.

Compare the resume and job description to assess:
1. The candidate's relevant skills and experiences.
2. Missing or underdeveloped skills required for the role.
3. Overall suitability for the job.

Here is the Resume:
{resume}

Here is the Job Description:
{job_description}

Your output must include:
- **Strengths**: List of relevant skills/experiences the candidate already has.
- **Missing Skills**: List of important skills in the job description that are not found in the resume.
- **Match Score**: A percentage between 0% and 100%, with a short explanation of the score.

Format your response in Markdown.
"""

model = OllamaLLM(model='llama3.2')
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

@app.post("/check",status_code=status.HTTP_200_OK)
async def check(user:Data):
    result = chain.invoke({"resume":user.resume,"job_description":user.job_description})
    return {"result":result}