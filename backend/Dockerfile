FROM python:3.6-slim

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

WORKDIR /app
COPY requirements.txt .
COPY src ./src
COPY build ./build

#RUN pip install nltk
#RUN pip install spacy==2.3.5
#RUN pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-2.3.1/en_core_web_sm-2.3.1.tar.gz
#RUN pip install pyresparser
RUN pip install --no-cache-dir -r requirements.txt
#RUN python -m spacy download en_core_web_sm
#RUN python -m nltk.downloader words
#RUN python -m nltk.downloader stopwords

CMD ["python", "./src/app.py"]
