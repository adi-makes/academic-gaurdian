import java.util.Scanner;

class dllphone {
    class Node {
        String phone;
        String name;
        Node next;
        Node prev;

        Node(String p, String n) {
            phone = p;
            name = n;
            next = null;
            prev = null;
        }
    }

    Node head = null;

    // Insert a new node
    void insert(String p, String n) {
        Node newNode = new Node(p, n);
        if (head == null) {
            head = newNode;
        } else {
            Node temp = head;
            while (temp.next != null) {
                temp = temp.next;
            }
            temp.next = newNode;
            newNode.prev = temp;
        }
    }

    // Update phone number using name
    void updatewithname(String n, String p) {
        if (head == null) {
            System.out.println("List is empty");
            return;
        }

        Node temp = head;
        while (temp != null && !temp.name.equalsIgnoreCase(n)) {
            temp = temp.next;
        }

        if (temp != null) {
            temp.phone = p;
            System.out.println("Phone number updated for " + n);
        } else {
            System.out.println("Name not found");
        }
    }

    // Delete a node if person leaves the city
    void delete(String n, boolean leave) {
        if (head == null) {
            System.out.println("List is empty");
            return;
        }

        if (!leave) {
            System.out.println(n + " did not leave the city. Not deleting.");
            return;
        }

        Node temp = head;
        while (temp != null && !temp.name.equals(n)) {
            temp = temp.next;
        }

        if (temp == null) {
            System.out.println("Name not found");
            return;
        }

        if (temp.prev != null) {
            temp.prev.next = temp.next;
        } else {
            head = temp.next; // deleting head
        }

        if (temp.next != null) {
            temp.next.prev = temp.prev;
        }

        System.out.println(n + " deleted from list.");
    }

    // Display all customers
    void display() {
        if (head == null) {
            System.out.println("List is empty");
            return;
        }
        Node temp = head;
        while (temp != null) {
            System.out.println("Name: " + temp.name + " | Phone: " + temp.phone);
            temp = temp.next;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        dllphone d = new dllphone();
        int ch;
        do {
            System.out.println("\nEnter:\n1. Insert\n2. Update phone by name\n3. Delete\n4. Display\n5. Exit");
            ch = sc.nextInt();
            switch (ch) {
                case 1:
                    System.out.println("Enter the name and phone number to insert:");
                    String name = sc.next();
                    String phone = sc.next();
                    d.insert(phone, name);
                    break;

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
