from setuptools import setup

import royweb

setup(name='royweb',
      version=royweb.version,
      url='http://github.com/tamasgal/royweb/',
      description='Restless Oyster online monitoring tool',
      author='Tamas Gal',
      author_email='tgal@km3net.de',
      packages=['royweb'],
      include_package_data=True,
      platforms='any',
      install_requires=[
          'tornado==3.2.2',
      ],
      entry_points={
          'console_scripts': [
              'royweb=royweb.__main__:main',
              'royweb_tester=royweb.__main__:send_test_parameter',
          ],
      },
      classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Intended Audience :: System Administrators',
        'Programming Language :: Python',
        'Programming Language :: JavaScript',
        'Topic :: Scientific/Engineering :: Visualization',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Internet :: WWW/HTTP :: HTTP Servers',
        'Environment :: Web Environment',
      ],
)

__author__ = 'Tamas Gal'
