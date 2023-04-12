import pandas as pd
import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
import math

dataset_origin_train = pd.read_csv('rssiValues4DBm_train.csv')
dataset_origin_test = pd.read_csv('rssiValues4DBm_test.csv')



X_train=dataset_origin_train[['7eb3bed60a67f44d','fc337481622c4dc8','4b528a07c6810670','de81d543721249f6','9fcccaab3f956f66','a58db253434c6759']]
Y_train=dataset_origin_train['position']


X_test=dataset_origin_test[['7eb3bed60a67f44d','fc337481622c4dc8','4b528a07c6810670','de81d543721249f6','9fcccaab3f956f66','a58db253434c6759']]
Y_test=dataset_origin_test['position']


X_train=np.array(X_train)
Y_train=np.array(Y_train)
X_test=np.array(X_test)
Y_test=np.array(Y_test)




gb_clf = GradientBoostingClassifier(n_estimators=30, learning_rate=0.5, max_features=2, max_depth=70, random_state=11)
gb_clf.fit(X_train, Y_train)

#Predict the response for test dataset
y_pred = gb_clf.predict(X_test)

testTrue=np.array(Y_test)
testPrev=y_pred
print("Test",np.array(Y_test))
print("Prev",y_pred)

#Import scikit-learn metrics module for accuracy calculation
from sklearn import metrics
from sklearn.metrics import f1_score
# Model Accuracy, how often is the classifier correct?
print("Accuracy:",metrics.accuracy_score(Y_test, y_pred))
print("F1-score:",f1_score(Y_test, y_pred, average='weighted')) #quanto mais perto de 1 melhor

i=0
sum=0.0
while i < len(testTrue):
  xtrue=testTrue[i].split("(")[1].split(',')[0].strip()
  ytrue=testTrue[i].split("(")[1].split(',')[1].split(')')[0].strip()
  xprev=testPrev[i].split("(")[1].split(',')[0].strip()
  yprev=testPrev[i].split("(")[1].split(',')[1].split(')')[0].strip()
  z=float(xtrue)-float(xprev)
  y=float(ytrue)-float(yprev)
  raiz=math.sqrt( z**2 + y**2 )
  sum = sum + raiz
  i+=1

erroMedio=sum/i
print("erroMedio",erroMedio)



# line=[[570.67,0,184.865,1, 32,8,0,16,0]]
# print("Previsao:",gb_clf.predict(line))

joblib.dump(gb_clf, 'model_location_zone1.pkl')

gb_clf = joblib.load('model_location_zone1.pkl')