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
    "tokenizer_stopword_in_not_stemmed"         : text_cleaning_stopword_in_not_stemmed,
    "tokenizer_stopword_in_stemmed"             : text_cleaning_stopword_in_stemmed,
    "tokenizer_stopword_removed_not_stemmed"    : text_cleaning_stopword_removed_not_stemmed,
    "tokenizer_stopword_removed_stemmed"        : text_cleaning_stopword_removed_stemmed
}

model_threshold = {
    'model_stopword_in_not_stemmed_bidirectional_keras_embedding'         : 0.480511,
    'model_stopword_in_not_stemmed_bidirectional_word2vec'                : 0.422630,
    'model_stopword_in_not_stemmed_non_bidirectional_keras_embedding'     : 0.445286,
    'model_stopword_in_not_stemmed_non_bidirectional_word2vec'            : 0.333427,
    'model_stopword_in_stemmed_bidirectional_keras_embedding'             : 0.491242,
    'model_stopword_in_stemmed_bidirectional_word2vec'                    : 0.272098,
    'model_stopword_in_stemmed_non_bidirectional_keras_embedding'         : 0.413950,
    'model_stopword_in_stemmed_non_bidirectional_word2vec'                : 0.357529,
    'model_stopword_removed_not_stemmed_bidirectional_keras_embedding'    : 0.412049,
    'model_stopword_removed_not_stemmed_bidirectional_word2vec'           : 0.394056,
    'model_stopword_removed_not_stemmed_non_bidirectional_keras_embedding': 0.473019,
    'model_stopword_removed_not_stemmed_non_bidirectional_word2vec'       : 0.384295,
    'model_stopword_removed_stemmed_bidirectional_keras_embedding'        : 0.491892,
    'model_stopword_removed_stemmed_bidirectional_word2vec'               : 0.307583,
    'model_stopword_removed_stemmed_non_bidirectional_keras_embedding'    : 0.479575,
    'model_stopword_removed_stemmed_non_bidirectional_word2vec'           : 0.428392,  
}

word2vec_dict = {
    'idwiki_100_cbow'     : 'idwiki_word2vec_100_new_lower.model',
    'idwiki_200_cbow'     : 'idwiki_word2vec_200_new_lower.model',
    'leizig_100_cbow'     : 'word2vec100_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_100_skipgram' : 'word2vec100_leipzig_stopword_in_not_stemmed_skip-gram.model',
    'leipzig_200_cbow'     : 'word2vec200_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_200_skipgram' : 'word2vec200_leipzig_stopword_in_not_stemmed_skip-gram.model',
    'leipzig_300_cbow'     : 'word2vec300_leipzig_stopword_in_not_stemmed_cbow.model',
    'leipzig_300_skipgram' : 'word2vec300_leipzig_stopword_in_not_stemmed_skip-gram.model',
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
    "tokenizer_stopword_in_not_stemmed"         : text_cleaning_stopword_in_not_stemmed_api,
    "tokenizer_stopword_in_stemmed"             : text_cleaning_stopword_in_stemmed_api,
    "tokenizer_stopword_removed_not_stemmed"    : text_cleaning_stopword_removed_not_stemmed_api,
    "tokenizer_stopword_removed_stemmed"        : text_cleaning_stopword_removed_stemmed_api
}

#======== END model related helper function ========

@api.route('/api/test')
@cross_origin()
def api_test():
    return jsonify('hello world')

@api.route('/api/predict', methods=['POST'])
@cross_origin()
def predict():
    start = datetime.now()
    data = request.json                         # get data from request

    text      = data['text']                    # get text
    stopword  = data['stopword']                # get the stopword parameter
    stemming  = data['stemming']                # get the stemming parameter
    lstm_mode = data['lstm']                    # get the lstm layer type parameter
    embedding = data['embedding']               # get the embedding type parameter

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
                "model"                 : model_name,
                "score"                 : float(score),
                "tokenizer"             : tokenizer_name,
                "text_cleaning_func"    : tokenizer_name.replace("tokenizer", "text_cleaning"),
                "runtime"               : float((datetime.now() - start).total_seconds()),
                'result'                : 0 if score < 0.5 else 1,
                'result_best_threshold' : 0 if score < best_threshold else 1,
                'best_threshold'        : best_threshold
               }

    return jsonify(response)

@api.route('/api/preprocess', methods=['POST'])
@cross_origin()
def preprocess():
    start = datetime.now()
    data = request.json                         # get data from request

    text      = data['text']                    # get text
    stopword  = data['stopword']                # get the stopword parameter
    stemming  = data['stemming']                # get the stemming parameter

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

    text      = data['text'].lower().split()    # get text
    corpus    = data['corpus']                  # get corpus
    dimension = str(data['dimension'])          # get the embedding dimension
    algorithm = data['algorithm']               # get the training algorithm

    model_name = word2vec_dict['_'.join([corpus, dimension, algorithm])]
    model_path = f'sites/app/word2vec/{model_name}'

    model = gensim.models.Word2Vec.load(model_path)

    result = model.wv.most_similar(text)

    return jsonify(result)

@api.route('/api/word2vec_sim_cosmul', methods=['POST'])
@cross_origin()
def word2vec_sim_cosmul():
    data = request.json                         # get data from request

    text_positive = data['text_positive'].lower().split()    # get positve text
    text_negative = data['text_negative'].lower().split()    # get negative text
    corpus        = data['corpus']                           # get corpus
    dimension     = str(data['dimension'])                   # get the embedding dimension
    algorithm     = data['algorithm']                        # get the training algorithm

    model_name = word2vec_dict['_'.join([corpus, dimension, algorithm])]
    model_path = f'sites/app/word2vec/{model_name}'

    model = gensim.models.Word2Vec.load(model_path)

    result = model.wv.most_similar_cosmul(text_positive, text_negative)

    return jsonify(result)
