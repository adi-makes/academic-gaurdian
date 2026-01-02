import java.util.Scanner;
class queue{
    class Node{
        int data;
        Node next;
        Node(int d){
            data=d;
            next=null;

        }
    };
    Node front=null;
    Node rear=null;
        void enqueue(int d){
            Node nn=new Node(d);
            if(rear==null){
                front=rear=nn;
            }
            else{
                rear.next=nn;
                rear=nn;
            }
        }
        void dequeue(){
            if(front==null){
                System.out.println("Queue is empty");
            }
            else
            {
                front=front.next;
                if(front==null){
                    rear=null;
                }   
            }
       

        }
        void display(){
            Node temp=front;
            while(temp!=null){
                System.out.print(temp.data+"->");
                temp=temp.next;
            }



        }
        
    
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        queue q=new queue();
        int ch;
        
        do{
        System.out.println("Enter 1 for enqueue 2 for dequeue 3 for display and 4 for exiting");
        ch=sc.nextInt();
        switch(ch){
            case 1:
                System.out.println("Enter the data to be enqueued :");
                 int data=sc.nextInt();
                 q.enqueue(data);
                 break;
            case 2:
                q.dequeue();
                break;
                
            case 3:
               System.out.println("The queue is :");
               q.display();
               break;
            case 4:
                System.out.println("EXITING");
                break;
            default:
                System.out.println("INVALID ENTRY");   
                           





        }
        }  while(ch!=4);


        
    }
}