import pandas as pd
import joblib
import numpy as np
import math
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score

dataset_origin_train = pd.read_csv('rssiValues4DBmDivisoes_Train.csv')
dataset_origin_test = pd.read_csv('rssiValues4DBmDivisoes_Test.csv')



X_train=dataset_origin_train[['4af6994df3a900b9','9a97a9cd9ac398de','b4c8c0b52049e4de']]
Y_train=dataset_origin_train['position']


X_test=dataset_origin_test[['4af6994df3a900b9','9a97a9cd9ac398de','b4c8c0b52049e4de']]
Y_test=dataset_origin_test['position']


X_train=np.array(X_train)
Y_train=np.array(Y_train)
X_test=np.array(X_test)
Y_test=np.array(Y_test)


#Import Gaussian Naive Bayes model
from sklearn.naive_bayes import GaussianNB

#Create a Gaussian Classifier
gnb = GaussianNB()

#Train the model using the training sets
gnb.fit(X_train, Y_train)

#Predict the response for test dataset
y_pred = gnb.predict(X_test)

from sklearn import metrics
from sklearn.metrics import f1_score


print("Test",np.array(Y_test))
print("Prev",y_pred)

testTrue=np.array(Y_test)
testPrev=y_pred

accuracy = accuracy_score(Y_test, y_pred)
f1 = f1_score(Y_test, y_pred, average='weighted')
print('Accuracy: ', "%.2f" % (accuracy*100))
print('F1 : ', "%.2f" % (f1*100))


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

joblib.dump(gnb, 'model_location_divisoes.pkl')

gb_clf = joblib.load('model_location_divisoes.pkl')