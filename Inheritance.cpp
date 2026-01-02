#include<iostream>
using namespace std;
class Shape{
public:
virtual void getdata()=0;
virtual void getarea()=0;
};
class Rectangle : public Shape{
    float length,breadth;
    void getdata(){
        cout<<"Enter the length and breadth";
        cin>>length>>breadth;
    }
    void getarea(){
        cout<<"The area is"<<length*breadth;
    }
};
class Circle : public Shape{
    float radius;
    void getdata(){
        cout<<"Enter radius";
        cin>>radius;
    }
    void getarea(){
        cout<<"Area is"<<3.14*radius*radius;
    }
};
int main(){
    Shape *s;
    Rectangle r;
    Circle c;
    s=&r;
    s->getdata();
    s->getarea();
} 




