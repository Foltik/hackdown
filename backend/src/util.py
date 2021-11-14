import os
import psycopg2

import json

def transact(fn):
    def wrapper(*args):
        conn = psycopg2.connect(dsn=os.environ['DB_URL'], database='app')
        res = fn(conn, *args)
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

        if resp is not None:
            self.write(json.dumps(resp))

    return wrapper
