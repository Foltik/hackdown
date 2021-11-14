#!/usr/bin/env python3

import tornado.ioloop
import tornado.web

from populate import PopulateHandler

from similarity.resume import ResumeHandler
from similarity.linkedin import LinkedinHandler

from data import DataHandler

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

app = tornado.web.Application([
    (r"/", MainHandler),

    (r"/populate", PopulateHandler),

    (r"/linkedin", LinkedinHandler),
    (r"/resume", ResumeHandler),

    (r"/data", DataHandler),
], **{
    'template_path':     './build',
    'static_path':       './build/static',
    'static_url_prefix': '/static/',
})

app.listen(8000)
tornado.ioloop.IOLoop.current().start()
