#include<iostream>
using namespace std;
class Time{
    int h;
    int m;
    int s;
    public:
    Time(int hour=0,int min=0,int sec=0){
        h=hour;
        m=min;
        s=sec;
    }
    void normalize(int s,int m,int h){
        if(s>=60){
            m+=s/60;
            s=s%60;
        }
        if(m>=60){
            h+=m/60;
            m=m%60;
        }   
        if(h>=24){
            h=h%24;
        }

    }
    Time operator+(int s){
         Time t;
         t.s+=s;
         t.normalize(t.s,t.m,t.h);
         return t;
    }
    void display(){
        cout<<"The time is:"<<endl;
        cout<<h<<":"<<m<<":"<<s<<endl;
    }
};
int main(){
    int h1,m1,s1,h2,m2,s2;
    cout<<"Enter the first time(h,m,s):"<<endl;
    cin>>h1>>m1>>s1;
    Time t1(h1,m1,s1);
    t1.normalize(   s1,m1,h1);
    t1.display();
    cout<<"Enter the no of seconds to add :"<<endl;
    int s;
    cin>>s;     
    cout<<"Time after adding seconds is:"<<endl;
    Time t2=t1+s;
            t2.normalize(       t2.s,t2.m,t2.h);
            t2.display();
            
            
            return 0;
        }

