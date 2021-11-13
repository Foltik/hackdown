import os
import psycopg2

import json

def transact(fn):
    def wrapper():
        conn = psycopg2.connect(dsn=os.environ['DB_URL'], database='app')
        res = fn(conn)
        conn.close()
        return res

    return wrapper

def api(fn):
    def wrapper(self):
        body = None if self.request.body == '' else json.loads(self.request.body)
        resp = fn(body)
        self.write(json.dumps(resp))

    return wrapper