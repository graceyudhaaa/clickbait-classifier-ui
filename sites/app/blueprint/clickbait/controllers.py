from flask import Blueprint, render_template

clickbait = Blueprint(
    "clickbait", __name__, template_folder="templates", static_folder="static"
)


@clickbait.route('/')
@clickbait.route('/text-preprocessing')
@clickbait.route('/similarities')
@clickbait.route('/cosmul')
def index():
    return render_template('clickbait.html')
