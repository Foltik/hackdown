import tornado.web
import json
import time

from util import transact, api

from scrape import glassdoor
from scrape import linkedin
from scrape import reddit

import data

COMPANY_LINKEDIN_URLS = [
    "https://www.linkedin.com/company/apple/",
    "https://www.linkedin.com/company/microsoft/",
    "https://www.linkedin.com/company/amazon/",
    "https://www.linkedin.com/company/google/",
    "https://www.linkedin.com/company/facebook/",
    "https://www.linkedin.com/company/paypal/",
    "https://www.linkedin.com/company/netflix/",
    "https://www.linkedin.com/company/intel-corporation/",
    "https://www.linkedin.com/company/salesforce/",
    "https://www.linkedin.com/company/airbnb/",
    "https://www.linkedin.com/company/zoom-video-communications/",
    "https://www.linkedin.com/company/amd/",
    "https://www.linkedin.com/company/joinsquare/",
    "https://www.linkedin.com/company/ibm/",
    "https://www.linkedin.com/company/instagram/"
]

COMPANY_NAMES = [
    "apple",
    "microsoft",
    "amazon",
    "google",
    "facebook",
    "paypal",
    "netflix",
    "intel",
    "salesforce",
    "airbnb",
    "zoom",
    "amd",
    "square",
    "ibm",
    "instagram"
]

def generate_json():
    db = {}

    db['reviews'] = []
    for company in COMPANY_NAMES:
        for (date, sentiment) in reddit.scrape(1628902090, time.time(), company):
            db['reviews'].append({
                'company': company,
                'source': 'reddit',
                'sentiment': sentiment,
                'date': str(date)
            })
    
    return db


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

if __name__ == "__main__":
    print(generate_json())
