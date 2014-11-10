import unittest
import selenium
from selenium import webdriver


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        try:
            self.browser = webdriver.Chrome()
        except:
            self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_title(self):
        # Edith heard about ROyWeb and fires up a browser to have a look at it
        self.browser.get('http://localhost:8080')

        # She notices the title of the page
        self.assertIn('Restless Oyster', self.browser.title)

# She opens the Graphs menu to see what kind of graphs are available

# She adds a new TimePlot to the dashboard by clicking on the menu button


if __name__ == '__main__':
    unittest.main()
