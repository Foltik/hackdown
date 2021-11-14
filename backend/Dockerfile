FROM python:3-slim

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

WORKDIR /app
COPY requirements.txt .
COPY src ./src
COPY build ./build

RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
RUN python -m nltk.downloader words
RUN python -m nltk.downloader stopwords

CMD ["python", "./src/app.py"]
