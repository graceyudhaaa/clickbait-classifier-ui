import io
import json

from tensorflow.keras.preprocessing.text import Tokenizer, tokenizer_from_json
from .text_cleaning import *

#======== model related helper function ======== 

####### tokenizer ####### 

def save_tokenizer_to_json(tokenizer, path):
  tokenizer_json = tokenizer.to_json()
  with io.open(path, 'w', encoding='utf-8') as f:
    f.write(json.dumps(tokenizer_json, ensure_ascii=False))

def load_tokenizer_from_json(path):
  with open(path) as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)

  return tokenizer

####### text cleaning function ####### 

def text_cleaning_stopword_in_not_stemmed(text):
  text = text.lower().encode('ascii',  "ignore").decode('utf-8')
  text = replace_exclamation_question(text)
  text = remove_not_punct(text)
  text = replace_num(text)

  return text

def text_cleaning_stopword_in_stemmed(text):
  text = text.lower().encode('ascii',  "ignore").decode('utf-8')
  text = replace_exclamation_question(text)
  text = remove_not_punct(text)
  text = replace_num(text)
  text = stemming(text)

  return text

def text_cleaning_stopword_removed_not_stemmed(text):
  text = text.lower().encode('ascii',  "ignore").decode('utf-8')
  text = replace_exclamation_question(text)
  text = remove_not_punct(text)
  text = replace_num(text)
  text = remove_stopword(text)

  return text

def text_cleaning_stopword_removed_stemmed(text):
  text = text.lower().encode('ascii',  "ignore").decode('utf-8')
  text = replace_exclamation_question(text)
  text = remove_not_punct(text)
  text = replace_num(text)
  text = remove_stopword(text)
  text = stemming(text)

  return text

#======== END model related helper function ========