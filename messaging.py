import cgi
from google.appengine.api import users
import webapp2
import os
from google.appengine.ext.webapp import template

MAIN_PAGE_HTML = """\
<html>
  <body>
    <form action="/sign" method="post">
      <div><textarea name="content" rows="3" cols="60"></textarea></div>
      <div><input type="submit" value="Sign Guestbook"></div>
    </form>
  </body>
</html>
"""

class HomePage(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'home.html')
        self.response.write(template.render(path, {}))#MAIN_PAGE_HTML)

'''
class Guestbook(webapp2.RequestHandler):
    def post(self):
        self.response.write('<html><body>You wrote:<pre>')
        self.response.write(cgi.escape(self.request.get('content')))
        self.response.write('</pre></body></html>')
'''

app = webapp2.WSGIApplication([
    ('/', HomePage),
    #('/sign', Guestbook),
], debug=True)
