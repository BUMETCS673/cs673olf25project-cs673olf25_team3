# ----------------------------
# Stage 1: Base Stage
# ----------------------------
FROM python:3.11-slim AS base

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

# ----------------------------
# Stage 2: Development stage
# ----------------------------

FROM base AS dev

# Set the working directory
WORKDIR /app

# # Copy the installed packages from the builder stage
# COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy the application code
COPY . .

# Expose the Django port
EXPOSE 8000

# Run Django dev server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ----------------------------
# Stage 2: Test stage
# ----------------------------

FROM base AS test

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

CMD ["pytest", "-v", "--disable-warnings", "-q"]