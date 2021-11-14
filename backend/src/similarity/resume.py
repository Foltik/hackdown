import os
import tornado.web
from pyresparser import ResumeParser

from util import api

class ResumeHandler(tornado.web.RequestHandler):
    @api
    def post(self, body):
        file = self.request.files['resume'][0]

        name = file['filename']
        body = file['body']
        data = None

        with open('temp.pdf', 'w+b') as temp:
            temp.write(body)
            data = ResumeParser(temp.name).get_extracted_data()
            os.unlink(temp.name)

        print("file:", file)
        print("name:", name)
        print("data:", data)

        return {'id': 177013}