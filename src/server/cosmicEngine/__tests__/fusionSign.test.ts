
/**
 * Tests for Fusion Sign Creator
 */

import { describe, it, expect } from "vitest";
import { generateFusionSign } from "../fusionSign";

describe("Fusion Sign Creator", () => {
    
    // Golden Case: Metal (Day Master) + Earth (Sun Sign)
    // As per documentation: Metal (Yang) core inside Earth (Yin) container.
    it("should generate correct sign for Metal Day Master and Virgo (Earth) Sun", () => {
        const result = generateFusionSign("Metal", "Virgo");
        
        expect(result.elements.bazi).toBe("Metal");
        expect(result.elements.western).toBe("Earth");
        
        // Polarity Check: Metal (Yang) + Earth (Yin)
        // Foreground should be Yang (Diamond), Background Yin (Circle)
        // Note: SVG string parsing is brittle, so we check for presence of shape identifiers or attributes.
        // Diamond: polygon with 4 points
        // Circle: <circle ... />
        
        expect(result.svg).toContain('<circle'); // Background
        expect(result.svg).toContain('<polygon'); // Foreground
        
        // Colors
        // Yang Foreground (Metal) -> Light Blue
        // Yin Background (Earth) -> Beige
        expect(result.colors.primary).toMatch(/#A8D8F8|#7FB6FF/); // Blue-ish
        expect(result.colors.secondary).toMatch(/#F2E8D1|#FAF5E6/); // Beige-ish
    });

    // Case: Fire (Yang) + Aries (Fire/Yang) -> Yang/Yang Conflict
    it("should handle Yang-Yang polarity conflict (Fire + Aries)", () => {
        const result = generateFusionSign("Fire", "Aries");
        
        // Both are Fire -> Yang
        // Conflict resolution should adjust colors for contrast
        // Expected: Different shades of Blue/White
        
        expect(result.colors.primary).not.toBe(result.colors.secondary);
        expect(result.svg).toContain('filter="url(#glow)"');
        
        // Shape: Both Yang.
        // Fire -> Triangle
        expect(result.svg).toContain('<polygon');
    });

    // Case: Water (Yin) + Cancer (Water/Yin) -> Yin/Yin Conflict
    it("should handle Yin-Yin polarity conflict (Water + Cancer)", () => {
        const result = generateFusionSign("Water", "Cancer");
        
        // Both Yin
        // Conflict resolution should adjust colors
        expect(result.colors.primary).not.toBe(result.colors.secondary);
    });

    // Case: Wood (Yang) + Pisces (Water/Yin) -> Generating Cycle
    it("should generate correct shapes for Wood (Triangle) and Pisces (Circle)", () => {
        const result = generateFusionSign("Wood", "Pisces");
        
        // Wood is Yang -> Triangle
        // Pisces is Water (Yin) -> Circle
        
        // Check for triangle points logic roughly or count of polygons
        expect(result.svg).toContain('<circle');
        expect(result.svg).toContain('<polygon');
    });
    
    it("should produce a description string", () => {
        const result = generateFusionSign("Metal", "Virgo");
        expect(result.description).toBeDefined();
        expect(result.description.length).toBeGreaterThan(10);
        expect(result.description).toContain("Metal");
        expect(result.description).toContain("Earth");
    });
    
    it("should handle unknown inputs gracefully (fallback)", () => {
        // "Plastic" element doesn't exist -> Defaults to something safe
        const result = generateFusionSign("Plastic", "Unicorn");
        
        expect(result.elements.western).toBeDefined();
        expect(result.svg).toBeDefined();
    });
});
