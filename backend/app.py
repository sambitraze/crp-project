from flask import Flask, request, jsonify
import pickle
from werkzeug.utils import secure_filename
import json
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import pandas as pd
from flask_cors import CORS

loaded_model = pickle.load(open("modelv1.sav", 'rb'))

app = Flask(__name__)
CORS(app)


def convert_obj_to_int(fm):
    object_list_columns = fm.columns
    object_list_dtypes = fm.dtypes
    for index in range(0, len(object_list_columns)):
        if object_list_dtypes[index] == object:
            fm[object_list_columns[index]] = fm[object_list_columns[index]].apply(
                lambda x: hash(x))
    return fm


@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello World'


@app.route('/', methods=['POST'])
def hello_world2():
    print("Hehehe", request.files['file'])
    posted_file = request.files['file']
    posted_file.save(secure_filename(posted_file.filename))
    if posted_file.filename[-3:] == 'csv':
        df_test = pd.read_csv(posted_file)
    elif posted_file.filename[-3:] == 'npy':
        df_test = np.load(posted_file, allow_pickle=True)
        df_test = pd.DataFrame(df_test)
    else:
        return jsonify({'no_of_ones': 0, 'no_of_zeros': 0, 'error': 'Invalid file type'})
    if df_test.shape[1] == 15:
        df_hashed_test = convert_obj_to_int(df_test)
        scaler = StandardScaler()
        fs_test = list(df_hashed_test.columns)
        df_hashed_test[fs_test] = scaler.fit_transform(df_hashed_test[fs_test])
        resp = loaded_model.predict(df_hashed_test)

        no_of_ones = resp.size - np.count_nonzero(resp)
        no_of_zeros = np.count_nonzero(resp)
        return jsonify({'no_of_ones': no_of_ones, 'no_of_zeros': no_of_zeros, 'error': 'NA'})
    else:
        return jsonify({'no_of_ones': 0, 'no_of_zeros': 0, 'error': 'Invalid number of columns'})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)
