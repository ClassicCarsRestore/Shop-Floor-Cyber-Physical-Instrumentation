import pandas as pd
import joblib
import numpy as np

dataset_origin = pd.read_csv('features_tools_train.csv')


dataset=dataset_origin.copy()

train=dataset

#todas as features sao consideradas
X_train=train[['Max', 'Min', 'Mean', 'Low Samples','Medium Samples','High Samples','Ultra Samples','Low Transictions','High Transictions']]
Y_train=train['Tool']




X_train=np.array(X_train)
Y_train=np.array(Y_train)



#o algoritmo com melhores resultados no google colab foi o KNN
from sklearn.neighbors import KNeighborsClassifier

#Create KNN Classifier
knn = KNeighborsClassifier(n_neighbors=3)

#Train the model using the training sets
knn.fit(X_train, Y_train)


#usado para verificar se esta tudo ok. Resposta correta e AngleGrinder
line=[[589.18, 9.0, 344.523, 1, 31, 15, 0, 15, 0]]
print("Previsao:",knn.predict(line))

#criacao do ficheiro pickle e save na pasta atual
joblib.dump(knn, 'model_tools_workshop.pkl')

clf = joblib.load('model_tools_workshop.pkl')
print("Model Created")