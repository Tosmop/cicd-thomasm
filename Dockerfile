# syntax=docker/dockerfile:1

# Build stage: Create the Python virtual environment and install dependencies
FROM debian:12-slim AS build

# hadolint ignore=DL3008
RUN apt-get update && \
    apt-get install --no-install-suggests --no-install-recommends --yes \
    python3-venv gcc libpython3-dev && \
    python3 -m venv /venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
FROM build AS build-venv

COPY requirements.txt /requirements.txt
RUN /venv/bin/pip install --disable-pip-version-check --no-cache-dir -r /requirements.txt

# Production stage: use a minimal and secure base image
FROM gcr.io/distroless/python3-debian12:latest-amd64

# Set environment variables
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Use a non-root user for better security
USER nobody

# Set working directory
WORKDIR /app

# Copy the virtual environment and application code
COPY --from=build-venv /venv /venv
COPY . .

# Expose the application port
EXPOSE 8080

# Run the application with gunicorn
CMD ["gunicorn", "Project.wsgi:application", "--bind", "0.0.0.0:8080"]
