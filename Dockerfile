FROM python:3.9-slim-buster

RUN adduser --disabled-password --gecos '' app_user

USER root

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

USER app_user

CMD ["gunicorn", "Project.wsgi:application", "--bind", "0.0.0.0:8080"]