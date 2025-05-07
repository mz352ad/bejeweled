package com.game.bejeweled;

import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UI {
    private static final Scanner scanner = new Scanner(System.in);
    private static final Pattern INPUT_PATTERN = Pattern.compile("([A-H])([0-7])([A-H])([0-7])");

    public void printBoard(Board board) {
        System.out.println("\n🔹 Current board:");
        System.out.print("     A   B   C    D   E   F   G    H  \n");

        for (int y = 0; y < board.getHeight(); y++) {
            System.out.print(y + "️⃣ ");
            for (int x = 0; x < board.getWidth(); x++) {
                System.out.print(" " + board.getGem(y, x).getEmoji() + " ");
            }
            System.out.println();
        }

        System.out.println("⭐ Score: " + board.getScore() + "\n");
    }

    public boolean handleMove(String input, Board board) {
        Matcher matcher = INPUT_PATTERN.matcher(input);
        if (matcher.matches()) {
            int x1 = matcher.group(1).charAt(0) - 'A';
            int y1 = Integer.parseInt(matcher.group(2));
            int x2 = matcher.group(3).charAt(0) - 'A';
            int y2 = Integer.parseInt(matcher.group(4));

            if (board.swapGems(x1, y1, x2, y2)) {
                System.out.println("\n✅ Move successful!");
                return true;
            } else {
                System.out.println("❌ Move failed! Try again.");
                return false;
            }
        } else {
            System.out.println("❌ Invalid input! Try again (format: A0B0).");
            return false;
        }
    }

    public String promptMove() {
        System.out.print("Enter move (e.g., A0B0) or X to exit: ");
        return scanner.nextLine().trim().toUpperCase();
    }

    public String prompt(String message) {
        System.out.print(message);
        return scanner.nextLine().trim();
    }
}
