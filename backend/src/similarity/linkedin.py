import tornado.web

from util import api

class LinkedinHandler(tornado.web.RequestHandler):
    @api
    def post(self, body):
        return {'foo': 'bar'}