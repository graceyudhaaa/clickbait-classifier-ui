from flask import Blueprint, render_template

clickbait = Blueprint(
    "clickbait", __name__, template_folder="templates", static_folder="static"
)

@clickbait.route('/')
@clickbait.route('/<path:path>')
def index(path):
    return render_template('clickbait.html')