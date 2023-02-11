import json
import base64
from flask import Blueprint, jsonify, request, Response
from flask_cors import CORS, cross_origin
from ...utils import (
    load_tokenizer_from_json,
    text_cleaning_stopword_in_not_stemmed,
    text_cleaning_stopword_in_stemmed,
    text_cleaning_stopword_removed_not_stemmed,
    text_cleaning_stopword_removed_stemmed
)
import gensim

from ...text_cleaning import *
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow import keras

from datetime import datetime

api = Blueprint(
    "api", __name__, template_folder="templates", static_folder="static"
)

text_cleaning_dict = {
    "tokenizer_stopword_in_not_stemmed": text_cleaning_stopword_in_not_stemmed,
    "tokenizer_stopword_in_stemmed": text_cleaning_stopword_in_stemmed,
    "tokenizer_stopword_removed_not_stemmed": text_cleaning_stopword_removed_not_stemmed,
    "tokenizer_stopword_removed_stemmed": text_cleaning_stopword_removed_stemmed
}

model_threshold = {
    'model_stopword_in_not_stemmed_bidirectional_keras_embedding': 0.324794,
    'model_stopword_in_not_stemmed_bidirectional_word2vec': 0.465115,
    'model_stopword_in_not_stemmed_non_bidirectional_keras_embedding': 0.365479,
    'model_stopword_in_not_stemmed_non_bidirectional_word2vec': 0.310083,
    'model_stopword_in_stemmed_bidirectional_keras_embedding': 0.337279,
    'model_stopword_in_stemmed_bidirectional_word2vec': 0.242802,
    'model_stopword_in_stemmed_non_bidirectional_keras_embedding': 0.453993,
    'model_stopword_in_stemmed_non_bidirectional_word2vec': 0.452290,
    'model_stopword_removed_not_stemmed_bidirectional_keras_embedding': 0.492096,
    'model_stopword_removed_not_stemmed_bidirectional_word2vec': 0.476125,
    'model_stopword_removed_not_stemmed_non_bidirectional_keras_embedding': 0.367642,
    'model_stopword_removed_not_stemmed_non_bidirectional_word2vec': 0.340811,
    'model_stopword_removed_stemmed_bidirectional_keras_embedding': 0.486688,
    'model_stopword_removed_stemmed_bidirectional_word2vec': 0.376050,
    'model_stopword_removed_stemmed_non_bidirectional_keras_embedding': 0.498264,
    'model_stopword_removed_stemmed_non_bidirectional_word2vec': 0.352744,
}

word2vec_dict = {
    'idwiki_100_cbow': 'idwiki_word2vec_100_new_lower.model',
    'idwiki_200_cbow': 'idwiki_word2vec_200_new_lower.model',
    'leipzig_100_cbow': 'word2vec100_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_100_skipgram': 'word2vec100_leipzig_stopword_in_not_stemmed_skip-gram.model',
    'leipzig_200_cbow': 'word2vec200_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_200_skipgram': 'word2vec200_leipzig_stopword_in_not_stemmed_skip-gram.model',
    'leipzig_300_cbow': 'word2vec300_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_300_skipgram': 'word2vec300_leipzig_stopword_in_not_stemmed_skip-gram.model',
}

####### text cleaning function #######


def text_cleaning_stopword_in_not_stemmed_api(text):
    return_dict = {
        'text': text,
    }

    text = text.lower().encode('ascii',  "ignore").decode('utf-8')
    return_dict['casefolding'] = text

    text = replace_exclamation_question(text)
    return_dict['replace_exclamation_question'] = text

    text = remove_not_punct(text)
    return_dict['remove_punct'] = text

    text = replace_num(text)
    return_dict['replace_num'] = text

    return return_dict, text


def text_cleaning_stopword_in_stemmed_api(text):
    return_dict = {
        'text': text,
    }

    text = text.lower().encode('ascii',  "ignore").decode('utf-8')
    return_dict['casefolding'] = text

    text = replace_exclamation_question(text)
    return_dict['replace_exclamation_question'] = text

    text = remove_not_punct(text)
    return_dict['remove_punct'] = text

    text = replace_num(text)
    return_dict['replace_num'] = text

    text = stemming(text)
    return_dict['stemming'] = text

    return return_dict, text


def text_cleaning_stopword_removed_not_stemmed_api(text):
    return_dict = {
        'text': text,
    }

    text = text.lower().encode('ascii',  "ignore").decode('utf-8')
    return_dict['casefolding'] = text

    text = replace_exclamation_question(text)
    return_dict['replace_exclamation_question'] = text

    text = remove_not_punct(text)
    return_dict['remove_punct'] = text

    text = replace_num(text)
    return_dict['replace_num'] = text

    text = remove_stopword(text)
    return_dict['remove_stopword'] = text

    return return_dict, text


def text_cleaning_stopword_removed_stemmed_api(text):
    return_dict = {
        'text': text,
    }

    text = text.lower().encode('ascii',  "ignore").decode('utf-8')
    return_dict['casefolding'] = text

    text = replace_exclamation_question(text)
    return_dict['replace_exclamation_question'] = text

    text = remove_not_punct(text)
    return_dict['remove_punct'] = text

    text = replace_num(text)
    return_dict['replace_num'] = text

    text = remove_stopword(text)
    return_dict['remove_stopword'] = text

    text = stemming(text)
    return_dict['stemming'] = text

    return return_dict, text


preprocessing_api_dict = {
    "tokenizer_stopword_in_not_stemmed": text_cleaning_stopword_in_not_stemmed_api,
    "tokenizer_stopword_in_stemmed": text_cleaning_stopword_in_stemmed_api,
    "tokenizer_stopword_removed_not_stemmed": text_cleaning_stopword_removed_not_stemmed_api,
    "tokenizer_stopword_removed_stemmed": text_cleaning_stopword_removed_stemmed_api
}

# ======== END model related helper function ========


@api.route('/api/test')
@cross_origin()
def api_test():
    return jsonify('hello world')


@api.route('/api/predict', methods=['POST'])
@cross_origin()
def predict():
    start = datetime.now()
    data = request.json                         # get data from request

    text = data['text']                    # get text
    stopword = data['stopword']                # get the stopword parameter
    stemming = data['stemming']                # get the stemming parameter
    # get the lstm layer type parameter
    lstm_mode = data['lstm']
    # get the embedding type parameter
    embedding = data['embedding']

    tokenizer_name = "_".join(['tokenizer', stopword, stemming])
    tokenizer_path = f"sites/app/tokenizers/{tokenizer_name}.json"

    text_cleaning_func = text_cleaning_dict[tokenizer_name]

    model_name = "_".join(['model', stopword, stemming, lstm_mode, embedding])
    model_path = f"sites/app/models/{model_name}"

    best_threshold = model_threshold[model_name]

    tokenizer = load_tokenizer_from_json(tokenizer_path)
    model = keras.models.load_model(model_path)

    # predict the text
    text = text_cleaning_func(text)
    sequence = tokenizer.texts_to_sequences([text])
    sequence = pad_sequences(sequence, maxlen=30)

    score = model.predict(sequence).flatten()[0]

    response = {
        "model": model_name,
        "score": float(score),
        "tokenizer": tokenizer_name,
        "text_cleaning_func": tokenizer_name.replace("tokenizer", "text_cleaning"),
        "runtime": float((datetime.now() - start).total_seconds()),
        'result': 0 if score < 0.5 else 1,
        'result_best_threshold': 0 if score < best_threshold else 1,
        'best_threshold': best_threshold
    }

    return jsonify(response)


@api.route('/api/about', methods=['POST'])
@cross_origin()
def about():
    data = request.json                         # get data from request

    stopword = data['stopword']                # get the stopword parameter
    stemming = data['stemming']                # get the stemming parameter
    # get the lstm layer type parameter
    lstm_mode = data['lstm']
    # get the embedding type parameter
    embedding = data['embedding']

    model_name = "_".join(['model', stopword, stemming, lstm_mode, embedding])

    evaluation_report_path = f"sites/app/evaluation_report/{model_name}"

    with open(f'{evaluation_report_path}/model_classification_report.json') as json_file:
        classification_report = json.load(json_file)

    with open(f'{evaluation_report_path}/model_classification_report_best_threshold.json') as json_file:
        classification_report_best_threshold = json.load(json_file)

    with open(f'{evaluation_report_path}/model_roc_auc_report.json') as json_file:
        roc_auc_report = json.load(json_file)

    with open(f"{evaluation_report_path}/confusion_matrix.png", "rb") as image_file:
        confusion_matrix = base64.b64encode(image_file.read()).decode('utf-8')

    with open(f"{evaluation_report_path}/confusion_matrix_best_threshold.png", "rb") as image_file:
        confusion_matrix_best_threshold = base64.b64encode(
            image_file.read()).decode('utf-8')

    with open(f"{evaluation_report_path}/ROC-Curve.png", "rb") as image_file:
        roc_curve = base64.b64encode(image_file.read()).decode('utf-8')

    response = {
        "model": model_name,
        'stopword': stopword,
        'stemming': stemming,
        'lstm_mode': lstm_mode,
        'embedding': embedding,
        'classification_report': classification_report,
        'classification_report_best_threshold': classification_report_best_threshold,
        'roc_auc_report': roc_auc_report,
        'confusion_matrix': confusion_matrix,
        'confusion_matrix_best_threshold': confusion_matrix_best_threshold,
        'roc_curve': roc_curve,
    }

    return jsonify(response)


@api.route('/api/preprocess', methods=['POST'])
@cross_origin()
def preprocess():
    start = datetime.now()
    data = request.json                         # get data from request

    text = data['text']                    # get text
    stopword = data['stopword']                # get the stopword parameter
    stemming = data['stemming']                # get the stemming parameter

    tokenizer_name = "_".join(['tokenizer', stopword, stemming])
    tokenizer_path = f"sites/app/tokenizers/{tokenizer_name}.json"
    tokenizer = load_tokenizer_from_json(tokenizer_path)
    text_cleaning_func = preprocessing_api_dict[tokenizer_name]

    response, text_preprocessed = text_cleaning_func(text)

    sequence = tokenizer.texts_to_sequences([text_preprocessed])
    sequence = pad_sequences(sequence, maxlen=30)

    response['tokenized'] = sequence.tolist()[0]

    return jsonify(response)


@api.route('/api/word2vec_sim', methods=['POST'])
@cross_origin()
def word2vec_sim():
    data = request.json                         # get data from request

    text = data['text']
    text = text_cleaning_stopword_in_not_stemmed(
        text).lower().split()    # get text

    corpus = data['corpus']                  # get corpus
    dimension = str(data['dimension'])          # get the embedding dimension
    algorithm = data['algorithm']               # get the training algorithm

    model_name = word2vec_dict['_'.join([corpus, dimension, algorithm])]
    model_path = f'sites/app/word2vec/{model_name}'

    model = gensim.models.Word2Vec.load(model_path)

    text_list = []
    for w in text:
        try:
            model.wv.get_vector(w)
            text_list.append(w)
        except:
            continue

    result = model.wv.most_similar(text_list)

    return jsonify(result)


@api.route('/api/word2vec_sim_cosmul', methods=['POST'])
@cross_origin()
def word2vec_sim_cosmul():
    data = request.json                         # get data from request

    text_positive = data['text_positive']
    text_positive = text_cleaning_stopword_in_not_stemmed(
        text_positive).lower().split()    # get positve text

    text_negative = data['text_negative']    # get negative text
    text_negative = text_cleaning_stopword_in_not_stemmed(
        text_negative).lower().split()    # get negative text

    corpus = data['corpus']                           # get corpus
    # get the embedding dimension
    dimension = str(data['dimension'])
    # get the training algorithm
    algorithm = data['algorithm']

    model_name = word2vec_dict['_'.join([corpus, dimension, algorithm])]
    model_path = f'sites/app/word2vec/{model_name}'

    model = gensim.models.Word2Vec.load(model_path)

    text_positive_list = []
    for w in text_positive:
        try:
            model.wv.get_vector(w)
            text_positive_list.append(w)
        except:
            continue

    text_negative_list = []
    for w in text_negative:
        try:
            model.wv.get_vector(w)
            text_negative_list.append(w)
        except:
            continue

    result = model.wv.most_similar_cosmul(
        text_positive_list, text_negative_list)

    return jsonify(result)
