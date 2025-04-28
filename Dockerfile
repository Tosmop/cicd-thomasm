# hadolint global ignore=DL3008
FROM debian:12-slim AS build

RUN apt-get update && \
    apt-get install --no-install-suggests --no-install-recommends --yes python3-venv gcc libpython3-dev && \
    python3 -m venv /venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM build AS build-venv

COPY requirements.txt /requirements.txt
RUN /venv/bin/pip install --disable-pip-version-check -r /requirements.txt

FROM gcr.io/distroless/python3-debian12:latest-amd64

# Set environment variables
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy the virtual environment
COPY --from=build-venv /venv /venv

# Set the working directory
WORKDIR /app

# Copy the app code
COPY . .

# Expose the application port
EXPOSE 8080

# Properly launch gunicorn from the virtual environment
CMD ["/venv/bin/gunicorn", "Project.wsgi:application", "--bind", "0.0.0.0:8080"]
