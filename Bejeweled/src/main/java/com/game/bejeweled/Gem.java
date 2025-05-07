package com.game.bejeweled;

public class Gem {
    private final GemType type;

    public Gem(GemType type) {
        this.type = type;
    }

    public GemType getType() {
        return type;
    }

    @Override
    public String toString() {
        return type.getSymbol();
    }

    public String getEmoji() { return type.getSymbol(); }

    public String getImageName() {
        return type.name().toLowerCase();  // наприклад: "red", "diamond" тощо
    }
}
