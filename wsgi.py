import logging
logging.basicConfig(filename='/tmp/error-flask.log',level=logging.DEBUG)
from proxy import app as application
