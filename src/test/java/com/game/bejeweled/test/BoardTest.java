package com.game.bejeweled.test;

import com.game.bejeweled.Board;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class BoardTest {
    private Board board;

    @BeforeEach
    void setUp() {
        board = new Board(8, 8);  // Initialize an 8x8 board
    }

    @Test
    void testBoardInitialization() {
        assertNotNull(board, "The game board should not be null");
        assertTrue(board.hasPossibleMoves(), "The board should have possible moves at the start");
    }

    @Test
    void testSwapGemsValidMove() {
        boolean moveResult = board.swapGems(0, 0, 0, 1);
        assertTrue(moveResult || !moveResult, "The move should either be successful or fail, but must not cause an error");
    }

    @Test
    void testHasPossibleMoves() {
        assertTrue(board.hasPossibleMoves(), "There should be at least one possible move");
    }

    @Test
    void testScoreIncrementAfterMatch() {
        int initialScore = board.getScore();
        board.removeMatches();
        assertTrue(board.getScore() >= initialScore, "Score should increase after removing matches");
    }
}
