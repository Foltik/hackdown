from linkedin import Company, Person, actions
from selenium import webdriver

if __name__ == "__main__":
    driver = webdriver.Chrome("/usr/bin/chromedriver")
    email = "hackdownteam@protonmail.com"
    password = "yEasDpHvcwnrA4G"
    actions.login(driver, email, password)
    #company = Company("https://www.linkedin.com/company/iron-galaxy-studios", driver=driver)
    #print(company)
    person = Person("https://www.linkedin.com/in/andre-iguodala-65b48ab5", driver=driver)
    print(person)