FROM python:3.11-rc-slim

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

WORKDIR /app
COPY requirements.txt .
COPY src ./src
COPY build ./build

RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
RUN Python -m nltk.downloader words

CMD ["python", "./src/app.py"]
