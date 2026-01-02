
import java.util.Scanner;

class sortmax{
    class Node{
        int data;
        Node next;
        Node prev;
        Node(int d){
            data=d;
            next=null;
            prev=null;
        }
    };
        Node head;
        Node tail;
        void insert(int d){
            Node nn=new Node(d);
            if(head==null){
                head=nn;
                tail=nn;


            }
            else{
                tail.next=nn;
                nn.prev=tail;
                tail=nn;
            }
        }
        void delete(Node n){
            if(n==head && n==tail){
                head=null;
                tail=null;
            }
            else if(n==head){
                head=head.next;
                head.prev=null;
            }
            else if(n==tail){
                tail=tail.prev;
                tail.next=null;
            }
            else{
                n.prev.next=n.next;
                n.next.prev=n.prev;
            }
        }
        void sort(){
            if(head==null || head.next==null){
                return;
            }
            Node current=head;
            while(current!=null){
                Node index=current.next;
                while(index!=null){
                    if(current.data>index.data){
                        int temp=current.data;
                        current.data=index.data;
                        index.data=temp;
                    }
                    index=index.next;
                }
                current=current.next;
            }
        }
       void display(){
        Node temp=head;
        while(temp!=null){
            System.out.print(temp.data+"->");
            temp=temp.next;
        }
       }
       void displaymax(){
        if(tail!=null){
            System.out.println("Maximum element is: "+tail.data);
        }
        else{
            System.out.println("List is empty");
       }
       }
       public static void main(String args[])
       {
        Scanner sc=new Scanner(System.in);
        sortmax list=new sortmax();
       
        
        do { 
             System.out.println("Enter 1 for insert,2 for delete,3 for displaying ,4 for displaying the largest element and 5 for exiting");
            int ch=sc.nextInt();
             switch(ch){
            case 1:
                System.out.println("Enter the element to be inserted");
                int d=sc.nextInt();
                list.insert(d);
                list.sort();
                break;
            case 2:
                System.out.println("Enter the element to be deleted");
                int del=sc.nextInt();
                Node temp=list.head;
                boolean found=false;
                while(temp!=null){
                    if(temp.data==del){
                        list.delete(temp);
                        found=true;
                        break;
                    }
                    temp=temp.next;
                }
                if(!found){
                    System.out.println("Element not found");
                }
                break;
            case 3:
                list.display();
                break;
            case 4:
                list.displaymax();
                break;
            case 5:
                System.exit(0);
            default:
                System.out.println("Invalid choice");
                break;
        }
            
        } while (true);
       }
    }



