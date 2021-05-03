from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.manifold import MDS

import numpy as np
import pandas as pd
def getPCA():
    #drop the categorical variables
    df = pd.read_csv("data/hw1_update.csv")
    df.drop(df.columns[[0]], axis=1, inplace=True)
    df.drop('year_of_renovation', axis=1, inplace=True)
    df.drop('view_of_house', axis=1, inplace=True)
    df.drop('condition_of_house', axis=1, inplace=True)
    df.drop('grade_of_house', axis=1, inplace=True)

    df_standard =  StandardScaler().fit_transform(df) 
    pca = PCA() 
    new_pc = pca.fit_transform(df_standard)  
    exp_var = pca.explained_variance_ratio_ #vars
    cum_exp_var = np.cumsum(exp_var) # cum vars
    pca_data = np.transpose(new_pc).tolist() # transpose the dataframe and get the array
    attribute = df.columns.tolist()
    old_df = df.T.to_dict()

    #k cluster with scaled data
    kmeans = KMeans(n_clusters = 3)
    kmeans.fit(df_standard)
    cluster_id = kmeans.predict(df_standard)
    color_list = []
    for i in cluster_id:
        if i == 0:
            color_list.append("red")
        elif i == 1:
            color_list.append("green")
        else:
            color_list.append("blue")
    #get the mds data
    embedding = MDS()
    mds_data = embedding.fit_transform(df).tolist()
    #get the mds variable plot
    df_corr_abs = df.corr().abs()
    mds_variable = (1-df_corr_abs).values
    mds_v = MDS(dissimilarity="precomputed")
    variable_coord = mds_v.fit_transform(mds_variable).tolist()
    #get dataset
    data_set = df.to_dict()
    return exp_var.tolist(),cum_exp_var.tolist(),pca.components_.tolist(),pca_data,attribute,np.transpose(df).values.tolist(),old_df,cluster_id.tolist(),color_list,mds_data,variable_coord,data_set    

