#!/usr/bin/env python3

import os
import time
import random
import time
import tempfile

import tornado.ioloop
import tornado.web

from pyresparser import ResumeParser

from util import transact, api

@transact
def create_test(conn):
    with conn.cursor() as cur:
        value = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for n in range(10))
        cur.execute(f"INSERT INTO test (value) VALUES ('{value}')")
        print(f"create_test(): status message: {cur.statusmessage}")
    conn.commit()

@transact
def delete_test(conn):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM test")
        print(f"delete_test(): status message: {cur.statusmessage}")
    conn.commit()

@transact
def get_test(conn):
    res = {}
    with conn.cursor() as cur:
        cur.execute("USE app; SELECT id, value FROM test")
        print(f"query_test(): status message: {cur.statusmessage}")
        rows = cur.fetchall()
        conn.commit()

        for id, value in rows:
            res[id] = value

    return res

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ResumeHandler(tornado.web.RequestHandler):
    @api
    def post(self):
        file = self.request.files['resume'][0]

        name = file['filename']
        body = file['body']

        with tempfile.TemporaryFile() as temp:
            temp.write(body)
            resume = ResumeParser(temp.name)
            print(resume)

        print("file:", file)
        print("name:", name)

        return {'id': 177013}

class CreateHandler(tornado.web.RequestHandler):
    def get(self):
        create_test()
        pass

class DeleteHandler(tornado.web.RequestHandler):
    def get(self):
        delete_test()
        pass

class GetHandler(tornado.web.RequestHandler):
    @api
    def get():
        return get_test()

app = tornado.web.Application([
    (r"/", MainHandler),
    (r"/resume", ResumeHandler),
    (r"/create", CreateHandler),
    (r"/delete", DeleteHandler),
    (r"/get", GetHandler)
], template_path='./build', static_path='./build/static')
app.listen(8000)
tornado.ioloop.IOLoop.current().start()