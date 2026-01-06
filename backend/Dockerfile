# --- Step 1: Base image ---
FROM python:3.13-slim AS base

# --- Step 2: Set working directory ---
WORKDIR /app

# --- Step 3: Copy requirements and install dependencies ---
COPY requirements.txt .

# Install system dependencies required for psycopg2 and cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libffi-dev \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# --- Step 4: Copy backend code ---
COPY . .

# --- Step 5: Expose port and set default command ---
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
