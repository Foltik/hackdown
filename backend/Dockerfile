FROM python:3.11-rc-slim

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

WORKDIR /app
COPY requirements.txt .
COPY src ./src
COPY build ./build

RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "./src/app.py"]
