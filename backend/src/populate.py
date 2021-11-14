import tornado.web

from util import transact, api

from scrape import glassdoor
from scrape import linkedin

import data

class PopulateHandler(tornado.web.RequestHandler):
    @api
    def post(self, c):
        data.insert_company(c)
        c = data.get_company_by_name(c['name'])
        print(c['id'], name, logo)
