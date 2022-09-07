import numpy as np
from scipy import stats
import pandas as pd
import plotly.graph_objects as go

x=[1992,1993,1994,1995]
y=[293,246,231,282,301,252,227,291,304,259,239,296,306,265,240,300]

movingAvg1=[]
for i in range(len(y)-3):
    s=0
    a=0
    for j in range(4):
        if(i+j<len(y)):
            s+=y[i+j]
    a=s/4
    movingAvg1.append(a)
print(movingAvg1)
    
movingAvg2=[]
for i in range(0,len(movingAvg1)-1):
    movingAvg2.append((movingAvg1[i]+movingAvg1[i+1])/2)
print(movingAvg2)


percent=[0,0]

for i in range(len(movingAvg2)):
    if( i+2<len(y)):
        dummy=(y[i+2]/movingAvg2[i])*100
        percent.append(dummy)
percent.append(0)    
percent.append(0) 

print(percent)


q1=[]
q2=[]
q3=[]
q4=[]

for i in range(0,13,4):
    q1.append(percent[0+i])
    q2.append(percent[1+i])
    q3.append(percent[2+i])
    q4.append(percent[3+i])

q1.remove(0)
q2.remove(0)
q3.remove(0)
q4.remove(0)
q1.sort()
q2.sort()
q3.sort()
q4.sort()

a1=sum(q1)/len(q1)
a2=sum(q2)/len(q2)
a3=sum(q3)/len(q3)
a4=sum(q4)/len(q4)

a=a1+a2+a3+a4


print("Quarter-1 : ",a1)
print("Quarter-2 : ",a2)
print("Quarter-3 : ",a3)
print("Quarter-4 : ",a4)

print("\nTotal Index: ",a,"\n")

deseason_i=[]
d=400/a

deseason_i.append(a1*d)
deseason_i.append(a2*d)
deseason_i.append(a3*d)
deseason_i.append(a4*d)

deseason_i=deseason_i*4

print("Modified Seasonal Index : ",deseason_i)

y0=[]

for i in range(len(y)):
    y0.append((y[i]/deseason_i[i])*100)
    
# print("d: ",y0)    
x=[0] * (len(y))
mid=len(y)//2-1

x[mid]=-0.5
x[mid+1]=0.5

for i in range(mid-1,-1,-1):
    x[i]=x[i+1]-1
    
for i in range(mid+2,len(x)):
    x[i]=x[i-1]+1

for i in range(len(x)):
    x[i]*=2   
    
yp=[]
def calculate_y():
    y0=[]
    for i in range(0,len(x)):
        dummy=0
        dummy=intercept+(slope*x[i])
        y0.append(dummy)
    return y0
        
#fit linear Regression Model
slope,intercept,r,p,std_err=stats.linregress(x,y0)
yp=calculate_y()
# print(x)
# print(slope,intercept)
   
#percent cyclic variation and relative cyclic
percent_trend=[]
relative_cyclic=[]
for i in range(len(y)):
    dummy=(y0[i]/yp[i])*100
    percent_trend.append(dummy)
    dummy=((y0[i]-yp[i])/yp[i])*100
    relative_cyclic.append(dummy)

print("Percent of trend : ",percent_trend,"\n")

print("Relative cyclic variation : ",relative_cyclic,"\n")

fig=go.Figure()
fig.add_trace(go.Scatter(y=y,mode="lines",name="Actual"))
fig.add_trace(go.Scatter(y=y0,mode="lines",name="Predicted"))
fig.add_trace(go.Scatter(y=percent_trend,mode="lines",name="Percent of trend"))
fig.add_trace(go.Scatter(y=relative_cyclic,mode="lines",name="Relative Cyclic Varaition"))
fig.show()
