from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from flask import Flask,render_template,make_response
from process import getPCA  

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/api")
def get_data():
    exp_var, cum_exp_var,pc,pca_data,attribute,original_data,old_df,cluster_id,color_list,mds_data,variable_coord,data_set= getPCA()
    data = {
        "exp_var":exp_var,
        "cum_exp_var":cum_exp_var,
        "pc":pc,
        "pca_data":pca_data,
        "attribute":attribute,
        "original_data":original_data,
        "old_df":old_df,
        "cluster_id":cluster_id,
        "color_list":color_list,
        "mds_data":mds_data,
        "variable_coord":variable_coord,
        "data_set":data_set
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)

