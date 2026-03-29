import java.io.*;

// Search in the CLI on a part of the camera name, and print the whole line if it matches. 
public class Search {
    public static void main(String[] args) {
        if(args.length == 0) {
            System.out.println("Please provide a search term as an argument.");
            return;
        } else if (args.length > 1) {
            System.out.println("Please provide only one search term.");
            return;
        }

        try (BufferedReader br = new BufferedReader(new FileReader("../data/cameras-defb.csv"))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.contains(args[0])) {
                    System.out.println(line);
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading file." + e.getMessage());
        }        
    }
}