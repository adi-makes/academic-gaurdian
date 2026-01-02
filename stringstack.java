class stringstack{
    class stack{
        String arr[];
        int top;
        int capacity;
        stack(int c){
            capacity=c;
            arr=new string[capacity];
            top=-1;
        }
        
    }
    void insert(String s){
        if(top==capacity-1){
            System.out.println("Stack overflow");
            return;
        }
        arr[++top]=s;
    }
    void findpos(String s){
        int temp=top;
        while(temp!=-1){
            if(arr[temp].equals(s)){
                System.out.println("Found at position: "+(temp+1));
                return;
            }
            temp--;
        }
        if(temp==-1){
        System.out.println("Not found");
    }}
    void highest(){
        if(top==-1){
            System.out.println("Stack is empty");
            return;
        }
        String max=arr[0];
        for(int i=1;i<=top;i++){
            if(arr[i].length()>max.length()){
                max=arr[i];
            }
        }
        System.out.println("Highest string is: "+max);
    }
    public static void main(String args[]){
        Scanner sc=new Scanner(System.in);
        stringstack ss=new stringstack();
        stack s=ss.new stack(10);
        int ch;
        do{
            System.out.println("Enter 1 for insert,2 for finding position of a string,3 for finding the highest length string and 4 for exit");
            ch=sc.nextInt();
            switch(ch){
                case 1:
                    System.out.println("Enter the string to be inserted");
                    String str=sc.next();
                    ss.insert(str);
                    break;
                case 2:
                    System.out.println("Enter the string to be found");
                    String find=sc.next();
                    ss.findpos(find);
                    break;
                case 3:
                    ss.highest();
                    break;
                case 4:
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid choice");
            }
        }while(ch!=4);
    }

}
