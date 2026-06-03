FROM python:3.12-slim

WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/
COPY frontend/package*.json /app/frontend/
RUN cd /app/frontend && npm install

COPY frontend/ /app/frontend/
RUN cd /app/frontend && npm run build

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV LOOP_MUSIC_DIR=/music

EXPOSE 8000 3000

CMD ["/app/start.sh"]