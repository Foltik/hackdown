import requests
from bs4 import BeautifulSoup

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

page_limit = 10
company = "Goldman Sachs"

#Search company
search_result_url = f'https://www.glassdoor.com/Search/results.htm?keyword={company}'
request_search_results = requests.get(search_result_url, headers=headers)
search_results_page = BeautifulSoup(request_search_results.content, 'html.parser')
search_results = search_results_page.find(id="Discover")

company_page_url_ending = search_results.find_all('a')[0].get('href')
company_name = company_page_url_ending.split('-')[2]
company_id = company_page_url_ending.split("EI_I")[1].split(".")[0]

for i in range(page_limit):
    company_page_url = f'https://www.glassdoor.com/Reviews/{company_name}-Reviews-{company_id}_P{i}.htm'
    request_company = requests.get(company_page_url, headers=headers)
    company_page = BeautifulSoup(request_company.content, 'html.parser')
    reviews = company_page.find(id="ReviewsFeed").find_all(class_="gdReview")

    for review in reviews:
        print(review.find_all('h2')[0].string)
