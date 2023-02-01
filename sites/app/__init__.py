import os
from flask import Flask, render_template, url_for, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from .config import *

from .blueprint.api.controllers import api
from .blueprint.clickbait.controllers import clickbait

load_dotenv()

# ===================Error handling===================


def page_not_found(error):
    return render_template("404.html"), 404


def unauthorized(error):
    return render_template("403.html"), 403


# ===================Error handling===================


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SECRET_KEY"] = SECRET_KEY

    basedir = os.path.abspath(os.path.dirname(__file__))

    # ===================Registering Error===================
    app.register_error_handler(404, page_not_found)
    app.register_error_handler(403, unauthorized)
    # ===================Registering Error===================

    # ===================Registering Blueprint===================

    app.register_blueprint(api)
    app.register_blueprint(clickbait)

    return app
