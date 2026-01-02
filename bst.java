class bst{
    class Node{
        int roll,cgpa;

        String word;
        Node left, right;

        public Node(String word, int roll, int cgpa){
            this.word = word;
            this.roll = roll;
            this.cgpa = cgpa;
            left = right = null;
        }
    }

    Node root;

    bst(){
        root = null;
    }

    void insert(String word, int roll, int cgpa){
        root = insertRec(root, word, roll, cgpa);
    }

    Node insertRec(Node root, String word, int roll, int cgpa){
        if (root == null){
            root = new Node(word, roll, cgpa);
            return root;
        }
        if (root.roll > roll)
            root.left = insertRec(root.left, word, roll, cgpa);
        else if (root.roll < roll)
            root.right = insertRec(root.right, word, roll, cgpa);
        return root;
    }

    void inorder(){
        inorderRec(root);
    }

    void inorderRec(Node root){
        if (root != null){
            inorderRec(root.left);
            System.out.print(root.word + " "+ root.roll + " " + root.cgpa + "\n");
            inorderRec(root.right);
        }
    }
    Node search(Node root,int roll){
        if(root==null || root.roll==roll){
            return root;
        }
        else if(root.roll>roll){
            return search(root.left, roll);
        }
        else
        return search(root.right, roll);

    }
    void updatebyroll(int roll, int newcgpa){
        Node res=search(root, roll);
        if(res!=null){
            res.cgpa=newcgpa;
        }
        else{
            System.out.println("Roll number not found");
        }
    }

    public static void main(String[] args){
        bst tree = new bst();
        tree.insert("apple", 3, 8);
        tree.insert("banana", 1, 9);    
        tree.insert("cherry", 2, 7);
        
    
        tree.inorder();
        tree.updatebyroll(2, 10);
        System.out.println("After updating cgpa:");
        tree.inorder();
              
    }
}