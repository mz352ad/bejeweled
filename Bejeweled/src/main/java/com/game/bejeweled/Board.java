package com.game.bejeweled;

import java.util.Random;

public class Board {
    private final int width;
    private final int height;
    private final Gem[][] grid;
    private static final Random RANDOM = new Random();
    private int score = 0;
    private static final String[] COLUMN_LABELS = {" A", " B", " C", "  D", " E", " F", " G", "  H"};
    private static final String[] ROW_LABELS = {"0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"};


    public Board(int width, int height) {
        this.width = width;
        this.height = height;
        this.grid = new Gem[height][width];
        initializeBoard();
    }

    public int getScore() {
        return score;
    }

    private void initializeBoard() {
        GemType[] types = GemType.values();
        do {
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    grid[y][x] = new Gem(types[RANDOM.nextInt(types.length)]);
                }
            }
        } while (!hasPossibleMoves());
    }


    private boolean areAdjacent(int x1, int y1, int x2, int y2) {
        return (Math.abs(x1 - x2) == 1 && y1 == y2) || (Math.abs(y1 - y2) == 1 && x1 == x2);
    }

    public boolean swapGems(int x1, int y1, int x2, int y2) {
        if (!areAdjacent(x1, y1, x2, y2)) {
            System.out.println("❌ Move failed! Tiles must be adjacent.");
            return false;
        }

        Gem temp = grid[y1][x1];
        grid[y1][x1] = grid[y2][x2];
        grid[y2][x2] = temp;

        if (checkMatchesAfterMove()) {
            removeMatches();
            return true;
        } else {
            temp = grid[y1][x1];
            grid[y1][x1] = grid[y2][x2];
            grid[y2][x2] = temp;
            System.out.println("❌ Move failed! No match was created.");
            return false;
        }
    }

    private boolean checkMatchesAfterMove() {
        boolean foundMatch = false;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width - 2; x++) {
                if (grid[y][x] != null && grid[y][x + 1] != null && grid[y][x + 2] != null &&
                        grid[y][x].getType() == grid[y][x + 1].getType() &&
                        grid[y][x].getType() == grid[y][x + 2].getType()) {
                    foundMatch = true;
                }
            }
        }

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height - 2; y++) {
                if (grid[y][x] != null && grid[y + 1][x] != null && grid[y + 2][x] != null &&
                        grid[y][x].getType() == grid[y + 1][x].getType() &&
                        grid[y][x].getType() == grid[y + 2][x].getType()) {
                    foundMatch = true;
                }
            }
        }

        return foundMatch;
    }

    public boolean hasPossibleMoves() {
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (x < width - 1) {
                    swapGemsWithoutCheck(x, y, x + 1, y);
                    if (checkMatchesAfterMove()) {
                        swapGemsWithoutCheck(x, y, x + 1, y);
                        return true;
                    }
                    swapGemsWithoutCheck(x, y, x + 1, y);
                }
                if (y < height - 1) {
                    swapGemsWithoutCheck(x, y, x, y + 1);
                    if (checkMatchesAfterMove()) {
                        swapGemsWithoutCheck(x, y, x, y + 1);
                        return true;
                    }
                    swapGemsWithoutCheck(x, y, x, y + 1);
                }
            }
        }
        return false;
    }

    private void swapGemsWithoutCheck(int x1, int y1, int x2, int y2) {
        Gem temp = grid[y1][x1];
        grid[y1][x1] = grid[y2][x2];
        grid[y2][x2] = temp;
    }


    public boolean checkMatches() {
        boolean foundMatch = false;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width - 2; x++) {
                if (grid[y][x].getType() == grid[y][x + 1].getType() &&
                        grid[y][x].getType() == grid[y][x + 2].getType()) {
                    foundMatch = true;
                }
            }
        }

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height - 2; y++) {
                if (grid[y][x].getType() == grid[y + 1][x].getType() &&
                        grid[y][x].getType() == grid[y + 2][x].getType()) {
                    foundMatch = true;
                }
            }
        }
        return foundMatch;
    }

    public void removeMatches() {
        boolean[][] toRemove = new boolean[height][width];
        int scoreIncrement = 0;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width - 2; x++) {
                if (grid[y][x] != null && grid[y][x + 1] != null && grid[y][x + 2] != null &&
                        grid[y][x].getType() == grid[y][x + 1].getType() &&
                        grid[y][x].getType() == grid[y][x + 2].getType()) {
                    toRemove[y][x] = toRemove[y][x + 1] = toRemove[y][x + 2] = true;
                    scoreIncrement += 10;
                }
            }
        }

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height - 2; y++) {
                if (grid[y][x] != null && grid[y + 1][x] != null && grid[y + 2][x] != null &&
                        grid[y][x].getType() == grid[y + 1][x].getType() &&
                        grid[y][x].getType() == grid[y + 2][x].getType()) {
                    toRemove[y][x] = toRemove[y + 1][x] = toRemove[y + 2][x] = true;
                    scoreIncrement += 10;
                }
            }
        }

        simulateGemDisappearance(toRemove);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (toRemove[y][x]) {
                    grid[y][x] = null;
                }
            }
        }

        score += scoreIncrement;
        dropNewGems();
    }

    private void simulateGemDisappearance(boolean[][] toRemove) {
        try {
            for (int step = 0; step < 3; step++) {
                clearConsole();
                System.out.println("\n💥 Removing matches...");
                for (int y = 0; y < height; y++) {
                    System.out.print(ROW_LABELS[y] + " ");
                    for (int x = 0; x < width; x++) {
                        if (toRemove[y][x]) {
                            System.out.print((step % 2 == 0) ? "⬜  " : "  ");
                        } else {
                            System.out.print(grid[y][x] != null ? grid[y][x] + "  " : "⬛  ");
                        }
                    }
                    System.out.println();
                }
                Thread.sleep(200);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }


    public void dropNewGems() {
        GemType[] types = GemType.values();

        for (int x = 0; x < width; x++) {
            int emptySpaces = 0;

            for (int y = height - 1; y >= 0; y--) {
                if (grid[y][x] == null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    grid[y + emptySpaces][x] = grid[y][x];
                    grid[y][x] = null;
                }
            }

            for (int y = 0; y < emptySpaces; y++) {
                grid[y][x] = new Gem(types[RANDOM.nextInt(types.length)]);
            }
        }

        printBoard();
        sleep(500);

        if (checkMatchesAfterMove()) {
            System.out.println("💥 Removing matches...");
            sleep(300);
            removeMatches();
        }
    }


    public void printBoard() {
        System.out.print("   ");
        for (String label : COLUMN_LABELS) {
            System.out.print(label + "  ");
        }
        System.out.println();

        for (int y = 0; y < height; y++) {
            System.out.print(ROW_LABELS[y] + " ");
            for (int x = 0; x < width; x++) {
                System.out.print(grid[y][x] != null ? grid[y][x] + "  " : "⬛  ");
            }
            System.out.println();
        }
    }

    private void clearConsole() {
        System.out.print("\033[H\033[2J");
        System.out.flush();
    }

    public int getHeight() {
        return height;
    }

    public int getWidth() {
        return width;
    }

    public Gem getGem(int y, int x) {
        return grid[y][x];
    }

    public void resetBoard() {
        this.score = 0;
        initializeBoard();
    }

    public boolean processMove(String input) {
        if (input.length() != 4) {
            System.out.println("❌ Invalid input length.");
            return false;
        }

        try {
            int x1 = input.charAt(0) - 'A';
            int y1 = input.charAt(1) - '0';
            int x2 = input.charAt(2) - 'A';
            int y2 = input.charAt(3) - '0';

            boolean swapped = swapGems(x1, y1, x2, y2);

            if (swapped) {
                while (checkMatches()) {
                    System.out.println("\n💥 Removing matches...");
                    removeMatches();
                    dropNewGems();
                }
                return true;
            } else {
                System.out.println("⚠️ Invalid move.");
            }
        } catch (Exception e) {
            System.out.println("❌ Error processing move: " + e.getMessage());
        }

        return false;
    }


}
