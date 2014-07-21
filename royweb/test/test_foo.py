import unittest

class ATestCase(unittest.TestCase):

    def setUp(self):
        pass

    def test_foo(self):
        self.assertEqual(1, 1)
