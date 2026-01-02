import java.util.Scanner;
public class main{
   static class stack{
     char[] data;
     int top;
     stack(int size){
          data=new char[size];
          top=-1;

     }
     void push(char value){
         if(top==data.length-1){
             System.out.println("Stack is full");
             return;
         }
         data[++top]=value;
     }
     char pop(){
         if(top==-1){
             System.out.println("Stack is empty");
             return '\0';
         }
         return data[top--];
     }
     char peek(){
         if(top==-1){
             System.out.println("Stack is empty");
             return '\0';
         }
         return data[top];
     }
   }
   static int prec(char op){
       switch(op){
           case '+':
           case '-':
               return 1;
           case '*':
           case '/':
               return 2;
           
           default:
               return 0;
       }
   }
   static String inftopo(String infix){
            stack s=new stack(infix.length());
            StringBuilder postfix=new StringBuilder();
            for (int i = 0; i < infix.length(); i++) {
                char c = infix.charAt(i);
                if (Character.isLetterOrDigit(c)) {
                    postfix.append(c);
                } else if (c == '(') {
                    s.push(c);
                } else if (c == ')') {
                    while (s.top != -1 && s.peek() != '(') {
                        postfix.append(s.pop());
                    }
                    s.pop(); // Pop the '(' from the stack
                } else { // operator
                    while (s.top != -1 && prec(s.peek()) >= prec(c)) {
                        postfix.append(s.pop());
                    }
                    s.push(c);
                }
            }

            while (s.top != -1) {
                postfix.append(s.pop());
            }
            String result=postfix.toString();

            return result;
   }
   public static void main(String[] args) {
       Scanner scanner = new Scanner(System.in);
       System.out.print("Enter infix expression: ");
       String infix = scanner.nextLine();
       String postfix = inftopo(infix);
       System.out.println("Postfix expression: " + postfix);
   }


}




