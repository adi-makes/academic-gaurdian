import java.util.Scanner;
class addpolysll
{
    class Node
    {
        int coeff;
        int power;
        Node next;
        Node(int c, int p)
        {
            coeff = c;
            power = p;
            next = null;
        }
    }
    Node head;
    public void insert(int c, int p)
    {
        Node newNode = new Node(c, p);
        if (head == null||head.power<p)
        {
            newNode.next = head;
            head = newNode;
        }
        else
        {
            Node temp = head;
            while (temp.next != null&&temp.next.power>p)
            {
                temp = temp.next;
            }
            if(temp.next != null && temp.next.power == p)
            {
                temp.next.coeff += c;
            }
            else
            {
                temp.next = newNode;
            }
        }
    }
    void display()
    {
        Node temp = head;
        while (temp != null)
        {
            System.out.print(temp.coeff + "x^" + temp.power);
            if (temp.next != null)
            {
                System.out.print(" + ");
            }
            temp = temp.next;
        }
        System.out.println();
    }
    addpolysll polynomialadd(addpolysll poly1, addpolysll poly2)
    {
        addpolysll result = new addpolysll();
        Node p1 = poly1.head;
        Node p2 = poly2.head;
        while (p1 != null || p2 != null)
        {
            if (p1 == null)
            {
                result.insert(p2.coeff, p2.power);
                p2 = p2.next;
            }
            else if (p2 == null)
            {
                result.insert(p1.coeff, p1.power);
                p1 = p1.next;
            }
            else if (p1.power == p2.power)
            {
                result.insert(p1.coeff + p2.coeff, p1.power);
                p1 = p1.next;
                p2 = p2.next;
            }
            else if (p1.power > p2.power)
            {
                result.insert(p1.coeff, p1.power);
                p1 = p1.next;
            }
            else
            {
                result.insert(p2.coeff, p2.power);
                p2 = p2.next;
            }
        }
        return result;
    }
    int evaluate(int x){
        int r=0;
        Node temp=head;
        while(temp!=null){
            r+=temp.coeff*Math.pow(x, temp.power);
            temp=temp.next;
        }
        return r;
    }
   public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        addpolysll poly1 = new addpolysll();
        addpolysll poly2 = new addpolysll();
        System.out.println("Enter number of terms in first polynomial:");
        int n1 = sc.nextInt();
        System.out.println("Enter coefficients and powers for first polynomial:");
        for (int i = 0; i < n1; i++)
        {
            int c = sc.nextInt();
            int p = sc.nextInt();
            poly1.insert(c, p);
        }
        System.out.println("Enter number of terms in second polynomial:");
        int n2 = sc.nextInt();
        System.out.println("Enter coefficients and powers for second polynomial:");
        for (int i = 0; i < n2; i++)
        {
            int c = sc.nextInt();
            int p = sc.nextInt();
            poly2.insert(c, p);
        }
        addpolysll result = poly1.polynomialadd(poly1, poly2);
        System.out.println("First Polynomial:");
        poly1.display();
        System.out.println("Second Polynomial:");
        poly2.display();
        System.out.println("Resultant Polynomial after addition:");
        result.display();
        sc.close();
   }}
