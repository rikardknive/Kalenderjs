from flask import Flask
from flask import render_template
from flask import jsonify
import gcal


app = Flask(__name__)

@app.route('/', defaults={'cal':'nhhs', 'lang':'no'})
@app.route('/<cal>/<lang>')
def hello_world(cal, lang):
    return render_template('index.html')

@app.route('/info')
def getInfo():
    info = gcal.hent_events()
    return jsonify(info)

if (__name__ == '__main__'):
    app.run(debug=True)