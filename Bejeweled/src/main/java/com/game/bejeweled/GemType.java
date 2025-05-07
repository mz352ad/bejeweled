package com.game.bejeweled;

public enum GemType {
    RED("🔴"),
    BLUE("🔵"),
    GREEN("🟢"),
    YELLOW("🟡"),
    PURPLE("🟣"),
    ORANGE("🟠"),
    WILD("💎");

    private final String symbol;

    GemType(String symbol) {
        this.symbol = symbol;
    }

    public String getSymbol() {
        return symbol;
    }
}
