# Multi-stage build for production-ready image

# Stage 1: Build dependencies
FROM python:3.11-slim as builder

# Set the working directory
WORKDIR /app

# Install system dependencies needed for some Python packages (e.g., psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker's cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the installed packages from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy the application code
COPY . .

# Expose the Django port
EXPOSE 8000

# Run Django migrations and start the server
# Use a more production-ready server like Gunicorn in a real-world scenario
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]