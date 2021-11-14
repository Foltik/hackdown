import praw
import requests
import json
import time
import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

API_ID = "e2blytTS1phtD2kA3fnBJw"
API_SECRET = "NLNASujjlQ4scv6SJfb2QCDoLsojJw"
API_AGENT = "hackdownproject"

SUB = "cscareerquestions"
QUERY = "Daily Chat Thread"

def get_pushshift_data(query, after, before, sub):
    url = 'https://api.pushshift.io/reddit/search/submission/?title='+str(query)+'&size=1000&after='+str(after)+'&before='+str(before)+'&subreddit='+str(sub)
    r = requests.get(url)
    try:
        data = json.loads(r.text)
    except json.decoder.JSONDecodeError:
        return []
    return data['data']

def parse_post_data(post):
    data = {
        'id': post['id'],
        'title': post['title'],
        'url': post['url'],
        'created_utc': datetime.datetime.fromtimestamp(post['created_utc']).date(),
    }
    try:
        flair = post['link_flair_text']
    except KeyError:
        flair = 'NaN'
    data['flair'] = flair
    return data

def scrape(after_timestamp: float, before_timestamp: float, keyword: str) -> list:
    before = int(before_timestamp)
    after = int(after_timestamp)
    data = get_pushshift_data(QUERY, after, before, SUB)

    post_data = []
    while len(data) > 0:
        for post in data:
            post_data.append(parse_post_data(post))
        after = data[-1]['created_utc']
        data = get_pushshift_data(QUERY, after, before, SUB)
    
    reddit = praw.Reddit(client_id=API_ID, client_secret=API_SECRET, user_agent=API_AGENT)

    comments_by_day = []
    for post in post_data:
        try:
            submission = reddit.submission(url=post['url'])
            submission.comments.replace_more(limit=0)
            comments = list([(comment.body.lower()) for comment in submission.comments])
        except:
            comments = []
        comments_by_day.append({'time': post['created_utc'], 'comments': comments})
    
    analyzer = SentimentIntensityAnalyzer()
    scores = []
    for daily_comments in comments_by_day:
        sentiment_score = 0
        try:
            for comment in daily_comments['comments']:
                if keyword in comment:
                    sentiment_score += analyzer.polarity_scores(comment)['compound']
        except TypeError:
            sentiment_score = 0
        
        scores.append((daily_comments['time'], sentiment_score))
    
    return scores

if __name__ == "__main__":
    print(scrape(1628902090, time.time(), "google"))
