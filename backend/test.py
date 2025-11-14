from google.genai import Client
import os

client = Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Are you working?"
)

print(response.text)
