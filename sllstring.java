import java.util.Scanner
class sllstring{
    class Node{
        String data;
        Node next;
        Node(String d){
            data=d;
            next=null;
        }
    }
    Node head=null;
    void push(String d){
        Node nn=new Node(d);
        if(head==null){
            head=nn;
        }
        else{
            Node temp=head;
            while(temp.next!=null){
                temp=temp.next;
            }
            temp.next=nn;
        }
    }
    void pop(){
        if(head==null){
            System.out.println("Stack is empty");
            return;
        }
        System.out.println("Popped element is: "+head.data);
        head=head.next;
    }
    void display(){
        if(head==null){
            System.out.println("Stack is empty");
            return;
        }
        Node temp=head;
        while(temp!=null){
            System.out.print(temp.data+"->");
            temp=temp.next;
        }
        System.out.println("NULL");
    }
    void findpos(String s){
        if(head==null){
            System.out.println("Stack is empty");
            return;
        }
        Node temp=head;
        int pos=1;
        while(temp!=null){
            if(temp.data.equals(s)){
                System.out.println("Found at position: "+pos);
                return;
            }
            temp=temp.next;
            pos++;
        }
        System.out.println("Not found");
    }
    String highest(){
        if(head==null){
            System.out.println("The stack is emppty");
            return;
        }
        Node temp=head;
        Node max=head;
        
        while(temp!=null){
            
           
            if(temp.data.length()>max.data.length){
                max=temp;
            }
            
            temp=temp.next;


        }
        return max.data;

    }
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        sllstring ss=new sllstring();
        int ch;
        do{System.out.println("\nEnter:\n1. Push\n2. pop\n3. findpos\n4. Display\n5. Exit");
            ch = sc.nextInt();
            switch (ch) {
                case 1:
                    System.out.println("String to be inserted");
                    String insert=sc.nextLine();
                    ss.push(insert);
                    

                case 2:
                    System.out.println("Enter the name whose phone number to update:");
                    String name1 = sc.next();
                    System.out.println("Enter the new phone number:");
                    String phone1 = sc.next();
                    d.updatewithname(name1, phone1);
                    break;

                case 3:
                    System.out.println("Did the person leave the city? (true/false):");
                    boolean leave = sc.nextBoolean();
                    System.out.println("Enter the name to delete:");
                    String name2 = sc.next();
                    d.delete(name2, leave);
                    break;

                case 4:
                    d.display();
                    break;

                case 5:
                    System.out.println("Exiting...");
                    break;

                default:
                    System.out.println("Invalid choice");
            }
        } while (ch != 5);
        sc.close();

        }    
    }


