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
        body = None
        try:
            if self.request.body != '':
                body = json.loads(self.request.body)
        except:
            pass

        resp = fn(self, body)
        self.write(json.dumps(resp))

    return wrapper