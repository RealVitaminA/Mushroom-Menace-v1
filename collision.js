/**
 * Collision detection system for Mushroom Menace
 * Handles collision detection between game entities
 */
class CollisionSystem {
    constructor(gridSize) {
        this.gridSize = gridSize;
    }
    
    // Check if two objects are colliding using bounding box
    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }
    
    // Check if a point is inside an object
    pointInObject(x, y, obj) {
        return (
            x >= obj.x &&
            x < obj.x + obj.width &&
            y >= obj.y &&
            y < obj.y + obj.height
        );
    }
    
    // Check if object is at grid position
    objectAtGridPosition(gridX, gridY, objects) {
        const x = gridX * this.gridSize;
        const y = gridY * this.gridSize;
        
        for (const obj of objects) {
            if (obj.gridX === gridX && obj.gridY === gridY) {
                return obj;
            }
        }
        
        return null;
    }
    
    // Check if object is out of bounds
    isOutOfBounds(obj, width, height) {
        return (
            obj.x < 0 ||
            obj.x + obj.width > width ||
            obj.y < 0 ||
            obj.y + obj.height > height
        );
    }
    
    // Get grid position from pixel coordinates
    getGridPosition(x, y) {
        return {
            gridX: Math.floor(x / this.gridSize),
            gridY: Math.floor(y / this.gridSize)
        };
    }
    
    // Get pixel coordinates from grid position
    getPixelPosition(gridX, gridY) {
        return {
            x: gridX * this.gridSize,
            y: gridY * this.gridSize
        };
    }
}
