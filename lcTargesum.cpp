#include<iostream>
using namespace std;
    int targe(int arr[],int n,int target,int i){
            int result=target-arr[i];
            for(int j=0;j<n;j++){
                if(arr[j]==result){
                    return j;
                }
                 
                
            }
            return -1;
          
        }
    
       


    
    int main(){
    int n,target;
    
    cout<<"Enter the no of elements:"<<endl;
    cin>>n;
    int arr[n];
    cout<<"Enter the elements";
    for(int i=0;i<n;i++){
        cin>>arr[i];
    }
    cout<<"Enter the target";
    cin>>target;
    
    for(int i=0;i<n;i++){
        int o=targe(arr,n,target,i);
        if(o==-1){
            cout<<"\nNo elements for"<<i<<endl;
        }
        else
        cout<<"["<<i<<","<<o<<"]";
    }

    }