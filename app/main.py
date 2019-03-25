from flask import Flask
from flask import render_template
from flask import jsonify
import gcal


app = Flask(__name__)

@app.route('/', defaults={'cal':'sfo'})
@app.route('/<cal>', defaults={'cal':'sfo'})
def hello_world(cal):
    return render_template('index.html')

@app.route('/sfo/info')
def getSfoInfo():
    info = gcal.hent_events('sfo')
    return jsonify(info)

@app.route('/jhi/info')
def getJhiInfo():
    info = gcal.hent_events('jhi')
    return jsonify(info)

@app.route('/kpmg/info')
def getKpmgInfo():
    info = gcal.hent_events('kpmg')
    return jsonify(info)

if (__name__ == '__main__'):
    app.run(debug=True)