import pandas as pd
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import math

train = pd.read_csv('rssiValuesTrain18Jan.csv')


#Escolha dos beacons a considerar para criação do Modelo de MLearning. Neste caso são todos os beacons. Pois a criacao
#do ficheiro de features no /TratamentoLocationData ja e feito so para beacons usados no Fingerprinting
X_train=train[['e2d0d77756858a3c','58a45c9d5037a520','359da2e3798189c9','b4c8c0b52049e4de','a58db253434c6759','9fcccaab3f956f66',
'4b528a07c6810670','fc337481622c4dc8','9a97a9cd9ac398de','7eb3bed60a67f44d']]

Y_train=train['position']


X_train=np.array(X_train)
Y_train=np.array(Y_train)


#Para o modelo de Fingerprinting a melhor solucao, no Google Colabs foi o RandomForest
clf=RandomForestClassifier(n_estimators=12,random_state=3)#n_estimators=12 & randomstate=3 -> accuracy 87.5% 

clf.fit(X_train,Y_train)


#usado para verificar se esta tudo ok. Resposta correta e P10
line=[[-65.5,-66.0,-68.45,-65.72,-47.07,-58.5,-57.81,-59.31,-60.59,-63.8]]
print("Previsao:",clf.predict(line))

#criacao do ficheiro pickle e save na pasta atual
joblib.dump(clf, 'model_location_full_zone1.pkl')

gb_clf = joblib.load('model_location_full_zone1.pkl')