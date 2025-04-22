FROM python:3.9-slim-buster

USER root

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

# Crée un utilisateur non-root
RUN useradd -m appuser
USER appuser

# Expose et lance
EXPOSE 8080
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
