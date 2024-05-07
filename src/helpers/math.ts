import { MinMax } from "@octo/models";
import { Vec2 } from "../models/vec";

export function getVectorPerpendicular(axis: Vec2<number>): Vec2<number> | null {
    if (!axis) {
        console.warn(`%c *** axis is null`, `background:#222; color: #bada55`);
        return null;
    }

    return { x: -axis.y, y: axis.x }
}

// Function to project a polygon onto a perpendicular axis
export function projectPolygonToAxis(vertices: Vec2<number>[], axis: Vec2<number>): MinMax {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    // Loop through each vertex of the polygon
    for (const vertice of vertices) {

        // Project the vertex onto the axis using the dot product
        const projection = vertice.x * axis.x + vertice.y * axis.y;

        // Update the minimum and maximum projection values
        if (projection < min) {
            min = projection;
        }
        if (projection > max) {
            max = projection;
        }
    }

    // Return the min and max projections
    return { min, max };
}


// Function to check for overlap between two projected intervals
export function intervalsOverlap(interval1: MinMax, interval2: MinMax): boolean {
    // If one interval is entirely to the left or right of the other, there is no overlap
    if (interval1.max < interval2.min || interval2.max < interval1.min) {
        return false;
    }
    // Otherwise, there is overlap
    return true;
}

/**
 * Returns a 'number' with decimals up to the precision
 * @param num 
 * @param precision 
 * @returns 
 */
export function toPrecisionNumber(num: number, precision: number): number {
    return parseFloat(num.toPrecision(precision));
}

export function diffVectors(vec1: Vec2<number>, vec2: Vec2<number>): number {
    // Use Pitagora theorem to calculate the vectors
    const vec1Length = Math.sqrt(Math.pow(vec1.x, 2) + Math.pow(vec1.y, 2));
    const vec2Length = Math.sqrt(Math.pow(vec2.x, 2) + Math.pow(vec2.y, 2));
    return vec1Length - vec2Length
}

export function createVector(direction: number, distance: number, origin?: Vec2<number>): Vec2<number> {
    return {
        x: Math.cos(direction) * distance + (origin?.x ?? 0),
        y: Math.sin(direction) * distance + (origin?.y ?? 0)
    }
}

export function dotProduct(v1: Vec2<number>, v2: Vec2<number>): number {
    return v1.x * v2.x + v1.y * v2.y;
}

export function magnitude(v: Vec2<number>): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function angleBetween(v1: Vec2<number>, v2: Vec2<number>, tolerance: number = 1e-6): number {
    const dot = dotProduct(v1, v2);
    const magProduct = magnitude(v1) * magnitude(v2);
    if (magProduct === 0) return 0; // To handle division by zero

    const cosTheta = dot / magProduct;
    const cosThetaClamped = Math.min(1, Math.max(-1, cosTheta)); // Ensure cosTheta is within [-1, 1]

    const theta = Math.acos(cosThetaClamped);

    // Calculate the cross product to determine the sign of the angle
    const crossProduct = v1.x * v2.y - v1.y * v2.x;
    const angle = crossProduct >= 0 ? theta : -theta;

    // If the absolute difference between the angle and zero is within the tolerance, consider it as zero
    if (Math.abs(angle) <= tolerance) {
        return 0;
    }

    return angle;
}

