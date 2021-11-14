from dataclasses import dataclass
from parse import *
from linkedin_scraper import Company, Person, actions
from selenium import webdriver
import json

@dataclass
class LinkedInUser:
    name: str = None
    years_of_experience: int = None
    skills: list = None
    schools_attended: list = None
    degrees: list = None

email = "hackdownteam@protonmail.com"
password = "yEasDpHvcwnrA4G"

def scrape_company(url: str) -> list:
    driver = webdriver.Chrome()
    actions.login(driver, email, password)

    company = Company(url, driver=driver)
    return list([employee for employee in company.employees if employee is not None])

def scrape_person(url: str) -> LinkedInUser:
    driver = webdriver.Chrome()
    actions.login(driver, email, password)

    person = Person(url, driver=driver)
    user = LinkedInUser()

    user.name = person.name
    
    years_of_experience = 0
    for experience in person.experiences:
        duration = experience.duration
        if duration is not None:
            years = search('{} yrs', duration)
            months = search('{} mos', duration)
            if years is not None:
                years_of_experience += int(years[0])
            if months is not None:
                years_of_experience += float(months[0]) / 12
    years_of_experience = int(years_of_experience) # truncate this to be pretty

    user.years_of_experience = years_of_experience

    user.skills = []
    for skill in person.skills:
        user.skills.append(skill.title)
    
    user.schools_attended = []
    user.degrees = []
    for school in person.educations:
        if school.institution_name is not None:
            user.schools_attended.append(school.institution_name)
        if school.degree is not None:
            user.degrees.append(school.degree)
    
    return user

def serialize_user(user: LinkedInUser, company: str):
    return json.dumps({
        'name': user.name,
        'company': company,
        'years_of_experience': user.years_of_experience,
        'skills': user.skills,
        'schools_attended': user.schools_attended,
        'degrees': user.degrees
    })

if __name__ == "__main__":
    company = "salesforce"

    print(serialize_user(scrape_person("https://www.linkedin.com/in/shariar-kabir/"), company))
    print(serialize_user(scrape_person("https://www.linkedin.com/in/sherrieshen/"), company))
    print(serialize_user(scrape_person("https://www.linkedin.com/in/hanming-yang-8275b017b/"), company))
    print(serialize_user(scrape_person("https://www.linkedin.com/in/shabbir-khan-sk/"), company))
    print(serialize_user(scrape_person("https://www.linkedin.com/in/ethanyehuda/"), company))
    