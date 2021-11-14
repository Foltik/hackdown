import json
import tornado.web

from util import transact, api

class DataHandler(tornado.web.RequestHandler):
    @api
    def post(self, body):
        return get_test()

@transact
def insert_company(con, c):
    with con.cursor() as cur:
        cur.execute(f"INSERT UPDATE INTO company (name, logo) VALUES ({c['name']}, {c['logo']})")
    con.commit()

@transact
def get_company_by_name(con, name):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM company WHERE name = '{name}'")
        rows = cur.fetchall()
        con.commit()
        return rows[0]

@transact
def get_company_by_id(con, id):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM company WHERE id = '{id}'")
        rows = cur.fetchall()
        con.commit()
        return rows[0]

@transact
def get_companies(con):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM company WHERE")
        rows = cur.fetchall()
        con.commit()
        return rows

@transact
def insert_person(con, c, p):
    with con.cursor() as cur:
        cur.execute(f"INSERT UPDATE INTO person (company_id, degrees, skills) VALUES ({c['id']}, '{','.join(p['degrees'])}', '{','.join(p['skills'])}')")
    con.commit()

@transact
def get_people_by_company(con, c):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM person WHERE company_id = {c['id']}")
        rows = cur.fetchall()
        con.commit()
        return rows

@transact
def insert_review(con, c, r):
    with con.cursor() as cur:
        cur.execute(f"INSERT UPDATE INTO review (company_id, source, sentiment, body, date) VALUES ({c['id']}, {r['source']}, {r['sentiment']}, {r['body']}, {r['date']}))")
    con.commit()

@transact
def get_reviews_by_company(con, c):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM review WHERE company_id = {c['id']}")
        rows = cur.fetchall()
        con.commit()
        return json.loads[rows[0][0]]

@transact
def set_test(con, company, obj):
    j = json.dumps(obj)
    delete_test()
    with con.cursor() as cur:
        cur.execute(f"INSERT INTO test (company, value) VALUES ('{company}', '{j}')")
    con.commit()

@transact
def delete_test(con, company):
    with con.cursor() as cur:
        cur.execute(f"DELETE FROM test WHERE company = '{company}'")
    con.commit()

@transact
def get_test(con, company):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM test")
        rows = cur.fetchall()
        con.commit()
        j = rows[0][1]
        return json.loads(j)

@transact
def get_tests(con):
    with con.cursor() as cur:
        cur.execute(f"SELECT * FROM test")
        rows = cur.fetchall()
        con.commit()
        return [json.loads(r[1]) for r in rows]
