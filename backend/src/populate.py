import tornado.web

from util import transact, api

from scrape import glassdoor
from scrape import linkedin

import data

class PopulateHandler(tornado.web.RequestHandler):
    @api
    def post(self, body):
        companies = [{
            'name': 'Google',
            'logo': 'static/google.png',
        }]

        reviews = glassdoor.scrape(company)
        for r in reviews:
            r['source'] = 'glassdoor'
            r['sentiment'] = 0.5

        data.delete_test("temp")
        data.set_test("temp", {
            'companies': companies,
            'reviews': reviews,
            'people': []
        })
